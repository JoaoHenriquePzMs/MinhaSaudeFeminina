/**
 * AppNavigator — Root Stack Navigator
 * Minha Saúde Feminina
 *
 * Wraps the entire app in a NavigationContainer and defines the root
 * NativeStack with:
 *   - 'Main'               → TabNavigator (the bottom-tab shell)
 *   - 'QuickRegisterModal' → QuickRegisterModal (modal presentation)
 *   - 'ArticleDetail'      → placeholder modal
 *   - 'Notifications'      → placeholder modal
 *   - 'DayDetail'          → placeholder modal
 *
 * Requirements: 7.5, 7.9, 7.10
 */

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import QuickRegisterModal from '../screens/QuickRegisterModal';

// ---------------------------------------------------------------------------
// Placeholder modal component
// ---------------------------------------------------------------------------

const PlaceholderModal = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title}</Text>
  </View>
);

// ---------------------------------------------------------------------------
// Stack navigator
// ---------------------------------------------------------------------------

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator is the single entry point for the navigation tree.
 * It must be rendered at the root of the component tree (e.g. in App.tsx).
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* ── Main shell (bottom tabs) ──────────────────────────────── */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* ── Modal screens ─────────────────────────────────────────── */}
        <Stack.Screen
          name="QuickRegisterModal"
          component={QuickRegisterModal}
          options={{ presentation: 'modal' }}
        />

        <Stack.Screen
          name="ArticleDetail"
          options={{ presentation: 'modal' }}
        >
          {() => <PlaceholderModal title="Article Detail" />}
        </Stack.Screen>

        <Stack.Screen
          name="Notifications"
          options={{ presentation: 'modal' }}
        >
          {() => <PlaceholderModal title="Notifications" />}
        </Stack.Screen>

        <Stack.Screen
          name="DayDetail"
          options={{ presentation: 'modal' }}
        >
          {() => <PlaceholderModal title="Day Detail" />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
