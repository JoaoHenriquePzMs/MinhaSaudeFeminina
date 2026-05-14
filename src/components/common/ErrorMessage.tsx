/**
 * ErrorMessage — Generic Error Display Component
 * Minha Saúde Feminina
 *
 * Displays an error message and an optional retry button.
 * Requirements: 6.9, 9.3
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string; // default: "Tentar novamente"
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryLabel = 'Tentar novamente',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message} accessibilityRole="text">
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          activeOpacity={0.7}
        >
          <Text style={styles.retryLabel}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    color: Colors.error,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    minWidth: 44,
    minHeight: 44,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryLabel: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default ErrorMessage;
