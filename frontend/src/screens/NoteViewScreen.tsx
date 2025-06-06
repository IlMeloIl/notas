import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { NoteViewScreenRouteProp, NoteViewScreenNavigationProp } from '@/types/Navigation';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/Note';
import { Typography, LoadingIndicator, Dialog, Header } from '@/components/ui';
import theme from '@/constants/theme';

const NoteViewScreen: React.FC = () => {
  const navigation = useNavigation<NoteViewScreenNavigationProp>();
  const route = useRoute<NoteViewScreenRouteProp>();
  const { noteId } = route.params;
  
  const { getNoteById, deleteNote, loading, error } = useNotes();
  
  const [note, setNote] = useState<Note | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const loadNote = useCallback(async () => {
    const loadedNote = await getNoteById(noteId);
    setNote(loadedNote);
  }, [noteId, getNoteById]);

  useFocusEffect(useCallback(() => { loadNote(); }, [loadNote]));

  const handleEdit = () => {
    if (note) navigation.navigate('NoteEdit', { noteId: note.id });
  };

  const handleDeletePress = () => setDeleteDialogVisible(true);

  const handleConfirmDelete = async () => {
    if (note) {
      setDeleteDialogVisible(false);
      const success = await deleteNote(note.id);
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a nota.');
      }
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleBack = () => navigation.goBack();

  const renderHeaderRight = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity style={styles.headerButton} onPress={handleEdit} disabled={!note}>
        <Feather name="edit" size={24} color={theme.colors.accent.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={handleDeletePress} disabled={!note}>
        <Feather name="trash-2" size={24} color={theme.colors.feedback.error} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading && !note) return <LoadingIndicator fullscreen text="Carregando nota..." />;
    if (error) return <Typography style={styles.errorText}>{error}</Typography>;
    if (!note) return <Typography>Nota não encontrada.</Typography>;

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Typography variant="h1" style={styles.title}>{note.title}</Typography>
        <View style={styles.metadataContainer}>
          <Typography variant="caption" style={styles.metadataText}>
            Criado em: {formatDate(note.createdAt)}
          </Typography>
          <Typography variant="caption" style={styles.metadataText}>
            Atualizado em: {formatDate(note.updatedAt)}
          </Typography>
        </View>
        <View style={styles.divider} />
        <Typography style={styles.content}>{note.content}</Typography>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Detalhes" leftComponent={<TouchableOpacity onPress={handleBack}><Feather name="arrow-left" size={24} color={theme.colors.text.primary} /></TouchableOpacity>} rightComponent={renderHeaderRight()} />
      <View style={styles.main}>{renderContent()}</View>
      <Dialog visible={deleteDialogVisible} title="Excluir Nota" message="Tem certeza que deseja excluir esta nota?" confirmText="Excluir" onConfirm={handleConfirmDelete} onCancel={() => setDeleteDialogVisible(false)} isDestructive />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background.primary },
    main: { flex: 1 },
    scrollView: { flex: 1 },
    contentContainer: { padding: theme.spacing.md },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    headerButton: { padding: theme.spacing.sm, marginLeft: theme.spacing.sm },
    title: { marginBottom: theme.spacing.md },
    metadataContainer: { marginBottom: theme.spacing.md },
    metadataText: { color: theme.colors.text.tertiary, marginBottom: theme.spacing.xs },
    divider: { height: 1, backgroundColor: theme.colors.border.light, marginBottom: theme.spacing.md },
    content: { lineHeight: 24 },
    errorText: { color: theme.colors.feedback.error, textAlign: 'center', marginTop: theme.spacing.md },
});

export default NoteViewScreen;