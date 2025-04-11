import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { NoteEditScreenRouteProp, NoteEditScreenNavigationProp } from '@/types/Navigation';
import { useNotes } from '@/hooks/useNotes';
import { CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';
import { 
  Typography, 
  TextField,
  LoadingIndicator,
  Dialog,
  Header
} from '@/components/ui';
import theme from '@/constants/theme';

const NoteEditScreen: React.FC = () => {
  const navigation = useNavigation<NoteEditScreenNavigationProp>();
  const route = useRoute<NoteEditScreenRouteProp>();
  const { noteId } = route.params || {};
  
  const { getNoteById, createNote, updateNote, loading, error } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [initialNote, setInitialNote] = useState({ title: '', content: '' });
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar dados da nota se estiver editando
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        const note = await getNoteById(noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setInitialNote({ title: note.title, content: note.content });
          setIsEditing(true);
        }
      }
    };

    loadNote();
  }, [noteId, getNoteById]);

  // Verificar se há alterações não salvas
  const hasUnsavedChanges = useCallback(() => {
    if (isEditing) {
      return title !== initialNote.title || content !== initialNote.content;
    }
    return title.trim() !== '' || content.trim() !== '';
  }, [title, content, initialNote, isEditing]);

  // Interceptar o botão de voltar do hardware
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (hasUnsavedChanges()) {
            setShowDiscardDialog(true);
            return true; // Previne a ação padrão de voltar
          }
          return false; // Permite a ação padrão de voltar
        }
      );

      return () => subscription.remove();
    }, [hasUnsavedChanges])
  );

  // Validar o título
  const validateTitle = () => {
    if (!title.trim()) {
      setTitleError('O título é obrigatório');
      return false;
    }
    if (title.length > 100) {
      setTitleError('O título não pode ter mais de 100 caracteres');
      return false;
    }
    setTitleError('');
    return true;
  };

  // Validar o conteúdo (opcional)
  const validateContent = () => {
    // Você pode adicionar validações específicas para o conteúdo se necessário
    // Por padrão, permitimos conteúdo vazio
    setContentError('');
    return true;
  };

  // Validar o formulário completo
  const validateForm = () => {
    const isTitleValid = validateTitle();
    const isContentValid = validateContent();
    return isTitleValid && isContentValid;
  };

  // Salvar a nota
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      // Preparar os dados da nota
      const noteData: CreateNoteDTO | UpdateNoteDTO = {
        title: title.trim(),
        content: content.trim()
      };

      if (isEditing && noteId) {
        // Atualizar nota existente
        const updatedNote = await updateNote(noteId, noteData);
        if (updatedNote) {
          // Atualizar estado inicial
          setInitialNote({ title: updatedNote.title, content: updatedNote.content });
          navigation.goBack();
        }
      } else {
        // Criar nova nota
        const newNote = await createNote(noteData as CreateNoteDTO);
        if (newNote) {
          navigation.goBack();
        }
      }
    } catch (err) {
      console.error('Erro ao salvar nota:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Tentar voltar/cancelar
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardDialog(true);
    } else {
      navigation.goBack();
    }
  };

  // Descartar alterações e voltar
  const handleDiscard = () => {
    setShowDiscardDialog(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.secondary} />
      
      {/* Cabeçalho */}
      <Header
        title={isEditing ? 'Editar Nota' : 'Nova Nota'}
        leftComponent={
          <TouchableOpacity onPress={handleCancel}>
            <Feather name="x" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading || !title.trim()}
          >
            <Feather 
              name="check" 
              size={24} 
              color={!title.trim() ? theme.colors.text.disabled : theme.colors.accent.primary} 
            />
          </TouchableOpacity>
        }
      />
      
      {/* Conteúdo Principal */}
      {loading && !isSaving ? (
        <LoadingIndicator fullscreen text="Carregando nota..." />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <Typography style={styles.errorText}>{error}</Typography>
          )}
          
          <TextField
            label="Título"
            value={title}
            onChangeText={setTitle}
            onBlur={validateTitle}
            error={titleError}
            placeholder="Título da nota"
            returnKeyType="next"
            autoFocus={!isEditing} // Focar no título apenas para novas notas
            fullWidth
          />
          
          <TextField
            label="Conteúdo"
            value={content}
            onChangeText={setContent}
            onBlur={validateContent}
            error={contentError}
            placeholder="Escreva o conteúdo da sua nota aqui..."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            style={styles.contentInput}
            fullWidth
          />
        </ScrollView>
      )}
      
      {/* Diálogo de confirmação para descartar alterações */}
      <Dialog
        visible={showDiscardDialog}
        title="Descartar alterações"
        message="Você tem alterações não salvas. Deseja realmente sair e descartar essas alterações?"
        confirmText="Descartar"
        cancelText="Continuar editando"
        onConfirm={handleDiscard}
        onCancel={() => setShowDiscardDialog(false)}
        isDestructive
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  contentInput: {
    minHeight: 200,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.feedback.error,
    marginBottom: theme.spacing.md,
  }
});

export default NoteEditScreen; 