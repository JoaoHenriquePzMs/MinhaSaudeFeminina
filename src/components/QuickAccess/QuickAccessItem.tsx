/**
 * QuickAccessItem — Card de atalho individual da grade de Acesso Rápido
 * Minha Saúde Feminina
 *
 * Requisitos: 5.3, 5.5, 5.6, 5.7, 9.2, 9.3
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickAccessItem } from '../../data/types';
import { BorderRadius, Colors } from '../../theme';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuickAccessItemProps {
  item: QuickAccessItem;
  onPress: (route: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const QuickAccessItemCard: React.FC<QuickAccessItemProps> = ({ item, onPress }) => {
  const handlePress = () => {
    onPress(item.route);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={item.accessibilityLabel}
    >
      <View style={styles.content}>
        <Ionicons
          name={item.icon as React.ComponentProps<typeof Ionicons>['name']}
          size={28}
          color={Colors.primary}
        />
        <Text style={styles.label} numberOfLines={1}>
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default QuickAccessItemCard;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    minWidth: 44,
    minHeight: 44,
    // Shadow — iOS
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Shadow — Android
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
