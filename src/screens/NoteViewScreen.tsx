import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  Alert 
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { NoteViewScreenRouteProp, NoteViewScreenNavigationProp } from '@/types/Navigation';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/Note';
import { 
  Typography, 
  LoadingIndicator,
  Dialog,
  Header
} from '@/components/ui';
import theme from '@/constants/theme';

const NoteViewScreen: React.FC = () => {
  const navigation = useNavigation<NoteViewScreenNavigationProp>();
  const route = useRoute<NoteViewScreenRouteProp>();
  const { noteId } = route.params;
  
  const { getNoteById, deleteNote, loading, error } = useNotes();
  
  const [note, setNote] = useState<Note | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Função para carregar a nota
  const loadNote = useCallback(async () => {
    const loadedNote = await getNoteById(noteId);
    setNote(loadedNote);
  }, [noteId, getNoteById]);

  // Recarregar a nota sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadNote();
    }, [loadNote])
  );

  // Navegação para editar nota
  const handleEdit = () => {
    if (note) {
      navigation.navigate('NoteEdit', { noteId: note.id });
    }
  };

  // Mostrar diálogo de confirmação para exclusão
  const handleDeletePress = () => {
    setDeleteDialogVisible(true);
  };

  // Confirmar e executar exclusão
  const handleConfirmDelete = async () => {
    if (note) {
      setDeleteDialogVisible(false);
      
      const success = await deleteNote(note.id);
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível excluir a nota. Por favor, tente novamente.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  // Formatar data para exibição
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Voltar para a tela anterior
  const handleBack = () => {
    navigation.goBack();
  };

  // Renderizar botões de ação no cabeçalho
  const renderHeaderRight = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={handleEdit}
        disabled={!note}
      >
        <Feather 
          name="edit" 
          size={24} 
          color={theme.colors.accent.primary} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={handleDeletePress}
        disabled={!note}
      >
        <Feather 
          name="trash-2" 
          size={24} 
          color={theme.colors.feedback.error} 
        />
      </TouchableOpacity>
    </View>
  );

  // Renderizar o conteúdo principal baseado no estado
  const renderContent = () => {
    // Estado de carregamento
    if (loading && !note) {
      return <LoadingIndicator fullscreen text="Carregando nota..." />;
    }

    // Estado de erro
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={48} color={theme.colors.feedback.error} />
          <Typography style={styles.errorText}>{error}</Typography>
          <TouchableOpacity style={styles.retryButton} onPress={() => getNoteById(noteId)}>
            <Typography style={styles.retryText}>Tentar novamente</Typography>
          </TouchableOpacity>
        </View>
      );
    }

    // Nota não encontrada
    if (!note) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="file-text" size={48} color={theme.colors.text.secondary} />
          <Typography variant="h2" style={styles.notFoundTitle}>
            Nota não encontrada
          </Typography>
          <Typography style={styles.notFoundText}>
            A nota solicitada não existe ou foi excluída.
          </Typography>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Typography style={styles.backButtonText}>Voltar para a lista</Typography>
          </TouchableOpacity>
        </View>
      );
    }

    // Exibir a nota
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h1" style={styles.title}>
          {note.title}
        </Typography>
        
        <View style={styles.metadataContainer}>
          <Typography variant="caption" style={styles.metadataText}>
            Criado em: {formatDate(note.createdAt)}
          </Typography>
          
          {note.updatedAt > note.createdAt && (
            <Typography variant="caption" style={styles.metadataText}>
              Atualizado em: {formatDate(note.updatedAt)}
            </Typography>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <Typography style={styles.content}>
          {note.content}
        </Typography>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.secondary} />
      
      {/* Cabeçalho */}
      <Header
        title="Detalhes"
        leftComponent={
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        }
        rightComponent={renderHeaderRight()}
      />
      
      {/* Conteúdo Principal */}
      <View style={styles.main}>
        {renderContent()}
      </View>
      
      {/* Diálogo de Confirmação para Exclusão */}
      <Dialog
        visible={deleteDialogVisible}
        title="Excluir Nota"
        message="Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogVisible(false)}
        isDestructive
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  main: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  metadataContainer: {
    marginBottom: theme.spacing.md,
  },
  metadataText: {
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginBottom: theme.spacing.md,
  },
  content: {
    lineHeight: 24, // Melhor legibilidade para textos longos
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.feedback.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.shape.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
  },
  retryText: {
    color: theme.colors.accent.primary,
  },
  notFoundTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  notFoundText: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    color: theme.colors.text.tertiary,
  },
  backButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.shape.borderRadius.sm,
    backgroundColor: theme.colors.accent.primary,
  },
  backButtonText: {
    color: theme.colors.common.white,
  },
});

export default NoteViewScreen; 