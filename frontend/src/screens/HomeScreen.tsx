import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  RefreshControl 
} from 'react-native';
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
    clearSearch
  } = useNotes();

  const [refreshing, setRefreshing] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const displayedNotes = searchQuery ? searchResults : notes;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (!hasAttemptedLoad) {
      setHasAttemptedLoad(true);
    }
    await getNotes();
    setRefreshing(false);
  }, [getNotes, hasAttemptedLoad]);
  
  const handleCreateNote = () => {
    navigation.navigate('NoteEdit', {});
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem note={item} />
  );
  
  const renderEmptyListComponent = () => (
    <View style={styles.centerContainer}>
      {searchQuery ? (
        <>
          <Feather name="search" size={48} color={theme.colors.text.secondary} />
          <Typography variant="h2" style={styles.emptyStateTitle}>
            Nenhuma nota encontrada
          </Typography>
          <Typography style={styles.emptyStateText}>
            Nenhuma nota corresponde à sua busca.
          </Typography>
          <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
            <Typography style={styles.clearSearchText}>Limpar busca</Typography>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Feather name="file-text" size={48} color={theme.colors.text.secondary} />
          <Typography variant="h2" style={styles.emptyStateTitle}>
            {hasAttemptedLoad ? "Nenhuma nota" : "Bem-vindo"}
          </Typography>
          <Typography style={styles.emptyStateText}>
            {hasAttemptedLoad 
              ? "Puxe para baixo para atualizar ou toque no + para criar uma nota."
              : "Puxe para baixo para carregar suas notas."}
          </Typography>
        </>
      )}
    </View>
  );

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
        {loading && !refreshing && !hasAttemptedLoad ? (
          <LoadingIndicator fullscreen text="Carregando notas..." />
        ) : error ? (
          <View style={styles.centerContainer}>
            <Feather name="alert-circle" size={48} color={theme.colors.feedback.error} />
            <Typography style={styles.errorText}>{error}</Typography>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Typography style={styles.retryText}>Tentar novamente</Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={displayedNotes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyListComponent}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.text.primary}
                colors={[theme.colors.accent.primary]}
              />
            }
          />
        )}
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
    flexGrow: 1, 
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