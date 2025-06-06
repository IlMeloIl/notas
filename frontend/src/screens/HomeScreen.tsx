import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { HomeScreenNavigationProp } from '@/types/Navigation';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/Note';
import { 
  Typography, 
  LoadingIndicator 
} from '@/components/ui';
import { NoteItem, SearchBar } from '@/components/notes';
import theme from '@/constants/theme';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    notes, 
    loading, 
    error, 
    getNotes,
    searchQuery,
    searchResults,
    setSearchQuery,
    clearSearch
  } = useNotes();

  const [refreshing, setRefreshing] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const displayedNotes = searchQuery ? searchResults : notes;

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasAttemptedLoad(true);
    await getNotes();
    setRefreshing(false);
  };
  
  const handleCreateNote = () => {
    navigation.navigate('NoteEdit', {});
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem note={item} />
  );
  
  const renderContent = () => {
    if (loading && hasAttemptedLoad && notes.length === 0) {
      return <LoadingIndicator fullscreen text="Carregando notas..." />;
    }

    if (error && hasAttemptedLoad) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={48} color={theme.colors.feedback.error} />
          <Typography style={styles.errorText}>{error}</Typography>
          <TouchableOpacity style={styles.retryButton} onPress={getNotes}>
            <Typography style={styles.retryText}>Tentar novamente</Typography>
          </TouchableOpacity>
        </View>
      );
    }

    if (displayedNotes.length === 0) {
      return (
        <View style={styles.centerContainer}>
          {searchQuery ? (
            <>
              <Feather name="search" size={48} color={theme.colors.text.secondary} />
              <Typography variant="h2" style={styles.emptyStateTitle}>
                Nenhuma nota encontrada
              </Typography>
              <Typography style={styles.emptyStateText}>
                Nenhuma nota corresponde aos termos da busca.
              </Typography>
              <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                <Typography style={styles.clearSearchText}>Limpar busca</Typography>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Feather name="file-text" size={48} color={theme.colors.text.secondary} />
              <Typography variant="h2" style={styles.emptyStateTitle}>
                {hasAttemptedLoad ? "Nenhuma nota" : "Bem-vindo ao NotesApp"}
              </Typography>
              <Typography style={styles.emptyStateText}>
                {hasAttemptedLoad 
                  ? "Toque no botão + para criar sua primeira nota."
                  : "Faça pull-to-refresh para carregar notas ou toque no botão + para criar sua primeira nota."}
              </Typography>
            </>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={displayedNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.secondary} />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>Notas</Typography>
      </View>
      
      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <SearchBar />
      </View>
      
      {/* Conteúdo Principal */}
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      {/* Botão de Adicionar Nota */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateNote}>
        <Feather name="plus" size={24} color={theme.colors.common.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    backgroundColor: theme.colors.background.secondary,
    paddingTop: theme.spacing.lg, 
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg + 60, 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyStateTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    color: theme.colors.text.tertiary,
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
  clearSearchButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.shape.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
  },
  clearSearchText: {
    color: theme.colors.accent.primary,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shape.shadows.medium,
  }
});

export default HomeScreen; 