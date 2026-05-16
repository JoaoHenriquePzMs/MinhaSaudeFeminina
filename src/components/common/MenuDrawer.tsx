/**
 * MenuDrawer — Drawer lateral de navegação compartilhado
 * Minha Saúde Feminina
 *
 * Usado em todas as telas que têm o botão de menu (☰).
 * Recebe a tela ativa para destacar o item correto.
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { TabParamList, RootStackParamList } from '../../navigation/types';

// ─── Menu items ───────────────────────────────────────────────────────────────

const MENU_ITEMS: {
  label: string;
  icon: string;
  screen: string;
  type: 'tab' | 'stack';
}[] = [
  { label: 'Início',    icon: 'home-outline',         screen: 'Hoje',               type: 'tab'   },
  { label: 'Meu Ciclo', icon: 'sync-outline',          screen: 'Ciclo',              type: 'tab'   },
  { label: 'Conteúdos', icon: 'book-outline',          screen: 'Conteudos',          type: 'tab'   },
  { label: 'Perfil',    icon: 'person-outline',        screen: 'Perfil',             type: 'tab'   },
  { label: 'Sintomas',  icon: 'medical-outline',       screen: 'Sintomas',           type: 'stack' },
  { label: 'Registrar', icon: 'add-circle-outline',    screen: 'QuickRegisterModal', type: 'stack' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  /** Name of the currently active screen — used to highlight the active item */
  activeScreen?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const MenuDrawer: React.FC<MenuDrawerProps> = ({ visible, onClose, activeScreen }) => {
  const tabNav = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const stackNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigate = (item: typeof MENU_ITEMS[0]) => {
    onClose();
    // Small delay so the modal closes before navigating (avoids flicker)
    setTimeout(() => {
      if (item.type === 'tab') {
        tabNav.navigate(item.screen as keyof TabParamList);
      } else {
        stackNav.navigate(item.screen as keyof RootStackParamList);
      }
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.overlay}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar menu"
      >
        {/* Prevent tap-through on the drawer itself */}
        <TouchableOpacity activeOpacity={1} style={s.drawer}>
          {/* Header */}
          <View style={s.drawerHeader}>
            <Text style={s.drawerTitle}>Minha Saúde Feminina</Text>
            <TouchableOpacity
              onPress={onClose}
              style={s.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Fechar menu"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Items */}
          {MENU_ITEMS.map((item) => {
            const isActive = item.screen === activeScreen;
            return (
              <TouchableOpacity
                key={item.screen}
                style={[s.item, isActive && s.itemActive]}
                onPress={() => handleNavigate(item)}
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isActive }}
                activeOpacity={0.7}
              >
                <View style={[s.itemIconWrap, isActive && s.itemIconWrapActive]}>
                  <Ionicons
                    name={item.icon as React.ComponentProps<typeof Ionicons>['name']}
                    size={20}
                    color={isActive ? Colors.textOnPrimary : Colors.primary}
                  />
                </View>
                <Text style={[s.itemText, isActive && s.itemTextActive]}>
                  {item.label}
                </Text>
                {isActive && (
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}

          {/* Divider + version */}
          <View style={s.footer}>
            <View style={s.footerDivider} />
            <Text style={s.footerVersion}>Minha Saúde Feminina · v1.0.0</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    flexDirection: 'row',
  },
  drawer: {
    width: 288,
    backgroundColor: Colors.surface,
    paddingTop: Spacing.xxxl,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },

  // Header
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  drawerTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.xs,
  },
  itemActive: {
    backgroundColor: Colors.surfacePink,
  },
  itemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconWrapActive: {
    backgroundColor: Colors.primary,
  },
  itemText: {
    flex: 1,
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textPrimary,
  },
  itemTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeightSemiBold,
  },

  // Footer
  footer: {
    marginTop: Spacing.xl,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: Spacing.md,
  },
  footerVersion: {
    fontSize: Typography.fontSizeCaption,
    color: Colors.textDisabled,
    textAlign: 'center',
  },
});

export default MenuDrawer;
