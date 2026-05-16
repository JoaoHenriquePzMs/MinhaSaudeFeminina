/**
 * TabNavigator — Bottom Tab Navigator
 * Minha Saúde Feminina
 *
 * Configures 5 visual slots:
 *   Hoje | Ciclo | [FAB +] | Conteúdos | Perfil
 *
 * The central FAB slot is a dedicated tab whose tabBarButton is fully replaced
 * by a circular TouchableOpacity that navigates to QuickRegisterModal.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 9.5
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityRole,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../theme';
import { TabParamList, RootStackParamList } from './types';

// ---------------------------------------------------------------------------
// Placeholder screen components (real screens will be created in tasks 13/14)
// ---------------------------------------------------------------------------

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>{name}</Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
});

// Try to import real screens; fall back to placeholders if they don't exist yet.
let HomeScreen: React.ComponentType = () => <PlaceholderScreen name="Hoje" />;
let CycleScreen: React.ComponentType = () => <PlaceholderScreen name="Ciclo" />;
let ContentsScreen: React.ComponentType = () => (
  <PlaceholderScreen name="Conteúdos" />
);
let ProfileScreen: React.ComponentType = () => (
  <PlaceholderScreen name="Perfil" />
);

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../screens/HomeScreen');
  HomeScreen = mod.default ?? mod.HomeScreen ?? HomeScreen;
} catch (_) {
  /* screen not yet created */
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../screens/CycleScreen');
  CycleScreen = mod.default ?? mod.CycleScreen ?? CycleScreen;
} catch (_) {
  /* screen not yet created */
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../screens/ContentsScreen');
  ContentsScreen = mod.default ?? mod.ContentsScreen ?? ContentsScreen;
} catch (_) {
  /* screen not yet created */
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../screens/ProfileScreen');
  ProfileScreen = mod.default ?? mod.ProfileScreen ?? ProfileScreen;
} catch (_) {
  /* screen not yet created */
}

// ---------------------------------------------------------------------------
// Tab configuration (4 real tabs — FAB is handled separately)
// ---------------------------------------------------------------------------

export interface TabConfig {
  /** Must match a key in TabParamList */
  name: keyof TabParamList;
  label: string;
  /** Ionicons name when tab is inactive */
  icon: string;
  /** Ionicons name when tab is active */
  iconActive: string;
  accessibilityLabel: string;
}

export const TAB_CONFIG: TabConfig[] = [
  {
    name: 'Hoje',
    label: 'Hoje',
    icon: 'home-outline',
    iconActive: 'home',
    accessibilityLabel: 'Hoje',
  },
  {
    name: 'Ciclo',
    label: 'Ciclo',
    icon: 'sync-outline',
    iconActive: 'sync',
    accessibilityLabel: 'Ciclo',
  },
  {
    name: 'Conteudos',
    label: 'Conteúdos',
    icon: 'book-outline',
    iconActive: 'book',
    accessibilityLabel: 'Conteúdos',
  },
  {
    name: 'Perfil',
    label: 'Perfil',
    icon: 'person-outline',
    iconActive: 'person',
    accessibilityLabel: 'Perfil',
  },
];

// ---------------------------------------------------------------------------
// Central FAB button
// ---------------------------------------------------------------------------

/**
 * CentralFABButton replaces the tabBarButton for the FAB slot.
 * It renders a circular 56×56dp button lifted 8dp above the tab bar.
 * Pressing it navigates to QuickRegisterModal (Requirement 7.5).
 */
const CentralFABButton: React.FC<BottomTabBarButtonProps> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('QuickRegisterModal');
  };

  return (
    <View style={fabStyles.wrapper}>
      <TouchableOpacity
        style={fabStyles.button}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel="Registrar dados de saúde"
      >
        <Ionicons name="add" size={28} color={Colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const fabStyles = StyleSheet.create({
  wrapper: {
    // Occupy the same horizontal space as a regular tab slot
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // Lift the FAB 8dp above the top edge of the tab bar (Requirement 7.3)
    marginBottom: 8,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow / elevation for visual separation
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
});

// ---------------------------------------------------------------------------
// Empty screen used as the FAB slot's "screen" (never actually shown)
// ---------------------------------------------------------------------------

const FABPlaceholderScreen: React.FC = () => null;

// ---------------------------------------------------------------------------
// Tab Navigator
// ---------------------------------------------------------------------------

/**
 * Extended param list that includes the hidden FAB slot.
 * The FAB slot is named 'FAB' and is never navigated to directly.
 */
type FullTabParamList = TabParamList & { FAB: undefined };

const Tab = createBottomTabNavigator<FullTabParamList>();

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Hoje"
      screenOptions={({ route }) => {
        const config = TAB_CONFIG.find((t) => t.name === route.name);

        return {
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            // Minimum 60dp + safe area bottom (Requirements 7.7, 7.8)
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (!config) return null;
            const iconName = focused ? config.iconActive : config.icon;
            return (
              <Ionicons
                name={iconName as React.ComponentProps<typeof Ionicons>['name']}
                size={size}
                color={color}
              />
            );
          },
          // Custom tabBarButton for accessibility (Requirements 7.2, 9.5)
          tabBarButton: (props) => {
            const isSelected = props.accessibilityState?.selected ?? false;
            const label = config?.accessibilityLabel ?? route.name;

            return (
              <TouchableOpacity
                {...props}
                accessibilityRole={'tab' as AccessibilityRole}
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={
                  isSelected ? `${label}, selecionada` : label
                }
                style={[props.style, tabButtonStyles.base]}
              />
            );
          },
        };
      }}
    >
      {/* ── Tab: Hoje ─────────────────────────────────────────────────── */}
      <Tab.Screen
        name="Hoje"
        component={HomeScreen}
        options={{ tabBarLabel: 'Hoje' }}
      />

      {/* ── Tab: Ciclo ────────────────────────────────────────────────── */}
      <Tab.Screen
        name="Ciclo"
        component={CycleScreen}
        options={{ tabBarLabel: 'Ciclo' }}
      />

      {/* ── Central FAB slot ──────────────────────────────────────────── */}
      {/*
       * This slot is never navigated to; its tabBarButton is fully replaced
       * by CentralFABButton which navigates to QuickRegisterModal instead.
       * The label and icon are hidden so only the FAB circle is visible.
       */}
      <Tab.Screen
        name="FAB"
        component={FABPlaceholderScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <CentralFABButton {...props} />,
        }}
      />

      {/* ── Tab: Conteúdos ────────────────────────────────────────────── */}
      <Tab.Screen
        name="Conteudos"
        component={ContentsScreen}
        options={{ tabBarLabel: 'Conteúdos' }}
      />

      {/* ── Tab: Perfil ───────────────────────────────────────────────── */}
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const tabButtonStyles = StyleSheet.create({
  base: {
    // Minimum touch target 44×44dp (Requirement 9.3)
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabNavigator;
