/**
 * QuickRegisterModal — Stub
 * Minha Saúde Feminina
 *
 * Placeholder modal for quick health data registration (FAB button).
 * Requirements: 7.5
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../theme';

export interface QuickRegisterModalProps {
  visible?: boolean;
  onClose?: () => void;
}

const QuickRegisterModal: React.FC<QuickRegisterModalProps> = ({
  visible = true,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Registro Rápido</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal de registro rápido"
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    lineHeight: Typography.lineHeightMediumTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
  },
});

export default QuickRegisterModal;
