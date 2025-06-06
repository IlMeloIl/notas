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

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }

    if (diffDays === 1) {
      return 'Ontem';
    }

    if (diffDays < 7) {
      const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return weekdays[date.getDay()];
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength = 80): string => {

    if (!content.trim()) return '';
    const normalizedContent = content.replace(/\n+/g, ' ').trim();

    if (normalizedContent.length <= maxLength) return normalizedContent;

    const truncated = normalizedContent.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    } else {
      return truncated + '...';
    }
  };

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

export default memo(NoteItem); 