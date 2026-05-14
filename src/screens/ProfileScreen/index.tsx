/**
 * ProfileScreen — Stub
 * Minha Saúde Feminina
 *
 * Placeholder screen for the Profile tab.
 * Requirements: 7.1
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../theme';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSizeLargeTitle,
    fontWeight: Typography.fontWeightSemiBold,
    lineHeight: Typography.lineHeightLargeTitle,
    color: Colors.textPrimary,
  },
});

export default ProfileScreen;
