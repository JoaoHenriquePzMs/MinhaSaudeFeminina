
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './Header.styles';
import { Colors } from '../../theme/colors';

export interface HeaderAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
  badgeCount?: number;
}

export interface HeaderProps {
  title?: string;
  onMenuPress: () => void;
  actions?: HeaderAction[];
}

const DEFAULT_TITLE = 'Minha Saúde Feminina';
const MAX_ACTIONS = 2;
const ICON_SIZE = 24;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function getBadgeLabel(badgeCount?: number): string | null {
  if (!badgeCount || badgeCount <= 0) {
    return null;
  }

  return badgeCount > 99 ? '99+' : String(badgeCount);
}

function buildActionAccessibilityLabel(action: HeaderAction): string {
  const badgeLabel = getBadgeLabel(action.badgeCount);

  if (!badgeLabel) {
    return action.accessibilityLabel;
  }

  return `${action.accessibilityLabel}, ${action.badgeCount} não lidas`;
}

function createVisibleActions(actions: HeaderAction[]): HeaderAction[] {
  return actions.slice(0, MAX_ACTIONS);
}

interface IconButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  accessibilityLabel: string;
  children?: React.ReactNode;
  style: object;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel,
  children,
  style,
}) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    hitSlop={HIT_SLOP}
  >
    <Ionicons
      name={icon}
      size={ICON_SIZE}
      color={Colors.textPrimary}
    />

    {children}
  </TouchableOpacity>
);

interface BadgeProps {
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ label }) => (
  <View
    style={styles.badge}
    accessibilityElementsHidden
    importantForAccessibility="no"
  >
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

interface HeaderActionsProps {
  actions: HeaderAction[];
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ actions }) => (
  <View style={styles.actionsContainer}>
    {actions.map((action) => {
      const badgeLabel = getBadgeLabel(action.badgeCount);

      return (
        <IconButton
          key={action.accessibilityLabel}
          icon={action.icon as React.ComponentProps<typeof Ionicons>['name']}
          onPress={action.onPress}
          accessibilityLabel={buildActionAccessibilityLabel(action)}
          style={styles.actionButton}
        >
          {badgeLabel && <Badge label={badgeLabel} />}
        </IconButton>
      );
    })}
  </View>
);

interface HeaderTitleProps {
  title: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title }) => (
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
);

interface MenuButtonProps {
  onPress: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onPress }) => (
  <IconButton
    icon="menu-outline"
    onPress={onPress}
    accessibilityLabel="Abrir menu de navegação"
    style={styles.menuButton}
  />
);

const Header: React.FC<HeaderProps> = ({
  title = DEFAULT_TITLE,
  onMenuPress,
  actions = [],
}) => {
  const insets = useSafeAreaInsets();
  const visibleActions = createVisibleActions(actions);

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      accessibilityRole="header"
    >
      <MenuButton onPress={onMenuPress} />

      <HeaderTitle title={title} />

      <HeaderActions actions={visibleActions} />
    </View>
  );
};

export default Header;