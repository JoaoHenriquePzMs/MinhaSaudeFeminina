/**
 * QuickAccess — Seção de Acesso Rápido (grade 2×2)
 * Minha Saúde Feminina
 *
 * Renders a 2×2 grid of quick-access shortcut cards. Accepts exactly 4 items
 * and an `onItemPress` callback that receives the destination route string.
 *
 * Requisitos: 5.1, 5.2, 5.3, 5.4, 5.8
 */

import React from 'react';
import { Text, View } from 'react-native';
import { QuickAccessItem } from '../../data/types';
import QuickAccessItemCard from './QuickAccessItem';
import { styles } from './QuickAccess.styles';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface QuickAccessProps {
  /** Exactly 4 quick-access items — Requisito 5.2, 5.3 */
  items: QuickAccessItem[];
  /** Called with the destination route when a card is pressed — Requisito 5.4 */
  onItemPress: (route: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * QuickAccess
 *
 * Renders the "Acesso Rápido" section title followed by a 2×2 grid of
 * `QuickAccessItemCard` components. The grid is built as two explicit rows
 * so that each card gets `flex: 1` within its row, guaranteeing equal widths
 * and heights regardless of screen size (Requisito 5.8).
 *
 * Gap of 12dp is applied between columns (via `gap` on the row) and between
 * rows (via `marginBottom` on the first row) — Requisitos 5.2, 5.8.
 */
const QuickAccess: React.FC<QuickAccessProps> = ({ items, onItemPress }) => {
  // Split the 4 items into two rows of 2
  const firstRow = items.slice(0, 2);
  const secondRow = items.slice(2, 4);

  return (
    <View style={styles.container}>
      {/* Section title — Requisito 5.1 */}
      <Text
        style={styles.sectionTitle}
        allowFontScaling
        maxFontSizeMultiplier={2}
      >
        Acesso Rápido
      </Text>

      {/* 2×2 grid — Requisitos 5.2, 5.8 */}
      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={[styles.row, styles.rowGap]}>
          {firstRow.map((item) => (
            <QuickAccessItemCard
              key={item.id}
              item={item}
              onPress={onItemPress}
            />
          ))}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {secondRow.map((item) => (
            <QuickAccessItemCard
              key={item.id}
              item={item}
              onPress={onItemPress}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default QuickAccess;
