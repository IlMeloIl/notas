import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/Navigation';
import { Note } from '@/types/Note';
import { Typography } from '@/components/ui';
import theme from '@/constants/theme';

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Formatação da data para exibição amigável
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Se for hoje, mostra a hora
    if (diffDays === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }
    
    // Se for ontem
    if (diffDays === 1) {
      return 'Ontem';
    }
    
    // Se for dentro de uma semana
    if (diffDays < 7) {
      const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return weekdays[date.getDay()];
    }
    
    // Caso contrário, mostra a data completa
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Truncar o conteúdo para visualização na prévia
  const truncateContent = (content: string, maxLength = 80): string => {
    // Se o conteúdo estiver vazio, retornar uma string vazia
    if (!content.trim()) return '';
    
    // Remover quebras de linha extras e espaços
    const normalizedContent = content.replace(/\n+/g, ' ').trim();
    
    // Truncar se necessário
    if (normalizedContent.length <= maxLength) return normalizedContent;
    
    // Truncar no último espaço completo para não cortar palavras
    const truncated = normalizedContent.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) {
      // Se houver um espaço razoavelmente próximo do final, cortar ali
      return truncated.substring(0, lastSpaceIndex) + '...';
    } else {
      // Caso contrário, cortar no tamanho máximo
      return truncated + '...';
    }
  };

  // Função para navegar para a visualização detalhada quando o item for tocado
  const handlePress = () => {
    navigation.navigate('NoteView', { noteId: note.id });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`note-item-${note.id}`}
    >
      <View style={styles.contentContainer}>
        <Typography variant="h2" style={styles.title} numberOfLines={1}>
          {note.title}
        </Typography>
        
        <Typography style={styles.preview} numberOfLines={2}>
          {truncateContent(note.content)}
        </Typography>
        
        <View style={styles.footer}>
          <Typography variant="caption" style={styles.date}>
            {formatDate(note.updatedAt)}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.shape.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shape.shadows.small,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  preview: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  date: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
});

// Usar memo para otimizar renderizações em listas longas
export default memo(NoteItem); 