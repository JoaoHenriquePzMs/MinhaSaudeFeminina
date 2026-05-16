/**
 * AppNavigator — Root Stack Navigator
 * Minha Saúde Feminina
 *
 * Fluxo:
 *   Login → Register  (auth stack)
 *   Main  → QuickRegisterModal | ArticleDetail | Notifications | DayDetail
 *
 * Requirements: 7.5, 7.9, 7.10
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import { LoginScreen, RegisterScreen } from '../screens/AuthScreen';
import QuickRegisterModal from '../screens/QuickRegisterModal';
import SintomasScreen from '../screens/SintomasScreen';

// ─── Placeholder modal ────────────────────────────────────────────────────────

import { View, Text } from 'react-native';
const PlaceholderModal = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title}</Text>
  </View>
);

// ─── Navigator ────────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* ── Auth screens ──────────────────────────────────────────── */}
        <Stack.Screen name="Login"    component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* ── Main app (tabs) ───────────────────────────────────────── */}
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

        <Stack.Screen
          name="Sintomas"
          component={SintomasScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
