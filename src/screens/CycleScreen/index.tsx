/**
 * CycleScreen — Stub
 * Minha Saúde Feminina
 *
 * Placeholder screen for the Cycle tab.
 * Requirements: 5.4
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../theme';

const CycleScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ciclo</Text>
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

export default CycleScreen;
