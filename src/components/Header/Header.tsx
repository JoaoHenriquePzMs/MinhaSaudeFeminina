/**
 * Header Component
 * Minha Saúde Feminina
 *
 * Displays a top app bar with:
 *  - Hamburger menu icon on the left (Req 2.1)
 *  - Centered, truncated title (Req 2.2)
 *  - Up to 2 action icons on the right with optional notification badge (Req 2.3, 2.8, 2.9)
 *  - Safe area padding on top (Req 2.6)
 *  - White background with elevation shadow (Req 2.7)
 *  - Accessible labels and minimum 44×44dp touch targets (Req 9.2, 9.3)
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 9.2, 9.3
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './Header.styles';
import { Colors } from '../../theme/colors';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface HeaderAction {
  /** Ionicons icon name (e.g. 'notifications-outline') */
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
  /** Badge count. Shows number if > 0; shows "99+" if > 99. */
  badgeCount?: number;
}

export interface HeaderProps {
  /** Displayed title. Defaults to "Minha Saúde Feminina". */
  title?: string;
  /** Callback fired when the hamburger menu icon is pressed. */
  onMenuPress: () => void;
  /** Up to 2 action icons rendered on the right side. */
  actions?: HeaderAction[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the badge label string, or null when no badge should be shown. */
function getBadgeLabel(badgeCount?: number): string | null {
  if (!badgeCount || badgeCount <= 0) return null;
  return badgeCount > 99 ? '99+' : String(badgeCount);
}

/** Builds the accessibility label for an action button, including badge info. */
function buildActionAccessibilityLabel(action: HeaderAction): string {
  const badgeLabel = getBadgeLabel(action.badgeCount);
  if (badgeLabel) {
    return `${action.accessibilityLabel}, ${action.badgeCount} não lidas`;
  }
  return action.accessibilityLabel;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DEFAULT_TITLE = 'Minha Saúde Feminina';
/** Maximum number of actions rendered on the right side (Req 2.8). */
const MAX_ACTIONS = 2;
/** Icon size for action buttons and menu. */
const ICON_SIZE = 24;

const Header: React.FC<HeaderProps> = ({
  title = DEFAULT_TITLE,
  onMenuPress,
  actions = [],
}) => {
  // Respect device safe area at the top (Req 2.6)
  const insets = useSafeAreaInsets();

  // Limit to at most 2 actions (Req 2.8)
  const visibleActions = actions.slice(0, MAX_ACTIONS);

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      accessibilityRole="header"
    >
      {/* ── Left: hamburger menu (Req 2.1, 2.4) ── */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu de navegação"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="menu-outline"
          size={ICON_SIZE}
          color={Colors.textPrimary}
        />
      </TouchableOpacity>

      {/* ── Center: title (Req 2.2) ── */}
      <View style={styles.titleContainer}>
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityRole="text"
        >
          {title}
        </Text>
      </View>

      {/* ── Right: action buttons (Req 2.3, 2.5, 2.8, 2.9) ── */}
      <View style={styles.actionsContainer}>
        {visibleActions.map((action) => {
          const badgeLabel = getBadgeLabel(action.badgeCount);
          const a11yLabel = buildActionAccessibilityLabel(action);

          return (
            <TouchableOpacity
              key={action.accessibilityLabel}
              style={styles.actionButton}
              onPress={action.onPress}
              accessibilityRole="button"
              accessibilityLabel={a11yLabel}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={action.icon as React.ComponentProps<typeof Ionicons>['name']}
                size={ICON_SIZE}
                color={Colors.textPrimary}
              />

              {/* Badge overlay (Req 2.9) */}
              {badgeLabel !== null && (
                <View
                  style={styles.badge}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  <Text style={styles.badgeText}>{badgeLabel}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Header;
