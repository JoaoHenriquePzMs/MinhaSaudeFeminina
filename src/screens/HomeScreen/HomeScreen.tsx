/**
 * HomeScreen — Tela Principal
 * Minha Saúde Feminina
 *
 * Composes the main home screen in vertical order:
 *   Header → CycleBanner → TodaySummary → QuickAccess → HealthContentCard
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 10.1, 10.2, 10.3
 */

import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import Header from '../../components/Header';
import CycleBanner from '../../components/CycleBanner';
import TodaySummary from '../../components/TodaySummary';
import QuickAccess from '../../components/QuickAccess';
import HealthContentCard from '../../components/HealthContentCard';
import MenuDrawer from '../../components/common/MenuDrawer';

// Hooks
import { useCycleData } from '../../hooks/useCycleData';
import { useTodaySummary } from '../../hooks/useTodaySummary';
import { useHealthContent } from '../../hooks/useHealthContent';

// Data & navigation
import { QUICK_ACCESS_ITEMS } from '../../data/mockData';
import { TabParamList, RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';

// Styles
import { styles } from './HomeScreen.styles';

// ---------------------------------------------------------------------------
// Notifications panel (modal)
// ---------------------------------------------------------------------------

interface NotificationsPanelProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: '1', icon: 'calendar',          title: 'Menstruação prevista',    body: 'Sua menstruação está prevista para daqui 14 dias.',  time: 'Agora' },
  { id: '2', icon: 'water',             title: 'Hidratação',              body: 'Lembre-se de beber pelo menos 2 litros de água hoje.', time: '1h atrás' },
  { id: '3', icon: 'shield-checkmark',  title: 'Exame preventivo',        body: 'Está na hora de agendar seu Papanicolau anual.',      time: '2h atrás' },
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ visible, onClose }) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={notifStyles.container} edges={['top', 'bottom']}>
      <View style={notifStyles.header}>
        <Text style={notifStyles.title}>Notificações</Text>
        <TouchableOpacity onPress={onClose} style={notifStyles.closeBtn} accessibilityRole="button" accessibilityLabel="Fechar notificações">
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={notifStyles.list}>
        {MOCK_NOTIFICATIONS.map((n) => (
          <View key={n.id} style={notifStyles.item}>
            <View style={notifStyles.itemIcon}>
              <Ionicons name={n.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={Colors.textOnPrimary} />
            </View>
            <View style={notifStyles.itemBody}>
              <Text style={notifStyles.itemTitle}>{n.title}</Text>
              <Text style={notifStyles.itemText}>{n.body}</Text>
              <Text style={notifStyles.itemTime}>{n.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

const notifStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightBold, color: Colors.textPrimary },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.base, gap: Spacing.sm },
  item: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  itemIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.circle,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary, marginBottom: 2 },
  itemText: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightRegular, color: Colors.textSecondary, lineHeight: Typography.lineHeightCaption, marginBottom: 4 },
  itemTime: { fontSize: Typography.fontSizeCaption, color: Colors.textDisabled },
});

// ---------------------------------------------------------------------------
// Day Detail panel (modal)
// ---------------------------------------------------------------------------

interface DayDetailPanelProps {
  visible: boolean;
  onClose: () => void;
}

const DayDetailPanel: React.FC<DayDetailPanelProps> = ({ visible, onClose }) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={dayStyles.container} edges={['top', 'bottom']}>
      <View style={dayStyles.header}>
        <Text style={dayStyles.title}>Resumo Completo</Text>
        <TouchableOpacity onPress={onClose} style={dayStyles.closeBtn} accessibilityRole="button" accessibilityLabel="Fechar resumo">
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={dayStyles.content}>
        {[
          { icon: 'calendar-outline',        label: 'Próxima Menstruação', value: 'em 14 dias',      color: Colors.primary },
          { icon: 'happy-outline',           label: 'Humor',               value: 'Bem-disposta',    color: '#F59E0B' },
          { icon: 'water-outline',           label: 'Hidratação',          value: '1,5L de 2L',      color: Colors.info },
          { icon: 'fitness-outline',         label: 'Atividade Física',    value: '30 min hoje',     color: Colors.success },
          { icon: 'moon-outline',            label: 'Sono',                value: '7h ontem',        color: '#9C27B0' },
          { icon: 'bulb-outline',            label: 'Dica do Dia',         value: 'Beba 2L de água', color: Colors.accent },
        ].map((item) => (
          <View key={item.label} style={dayStyles.row}>
            <View style={[dayStyles.rowIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={item.color} />
            </View>
            <View style={dayStyles.rowBody}>
              <Text style={dayStyles.rowLabel}>{item.label}</Text>
              <Text style={dayStyles.rowValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

const dayStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightBold, color: Colors.textPrimary },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.base, gap: Spacing.sm },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  rowIcon: { width: 44, height: 44, borderRadius: BorderRadius.circle, alignItems: 'center', justifyContent: 'center' },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightMedium, color: Colors.textSecondary },
  rowValue: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary, marginTop: 2 },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type TabNav = BottomTabNavigationProp<TabParamList>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  // ── Data hooks ────────────────────────────────────────────────────────
  const { cycleData } = useCycleData();
  const { summaryData } = useTodaySummary();
  const { contentData, isLoading, hasError, retry } = useHealthContent();

  // ── Navigation ────────────────────────────────────────────────────────
  const tabNav = useNavigation<TabNav>();
  const stackNav = useNavigation<StackNav>();

  // ── Modal state ───────────────────────────────────────────────────────
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [dayDetailVisible, setDayDetailVisible] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleMenuPress = () => setMenuVisible(true);

  const handleMenuNavigate = (screen: string) => {
    if (screen === 'QuickRegisterModal') {
      stackNav.navigate('QuickRegisterModal');
    } else {
      tabNav.navigate(screen as keyof TabParamList);
    }
  };

  const handleNotifications = () => setNotifVisible(true);

  const handleConfigureCycle = () => tabNav.navigate('Ciclo');

  const handleViewAll = () => setDayDetailVisible(true);

  const handleQuickAccess = (route: string) => {
    const tabRoutes: (keyof TabParamList)[] = ['Hoje', 'Ciclo', 'Conteudos', 'Perfil'];
    if (tabRoutes.includes(route as keyof TabParamList)) {
      tabNav.navigate(route as keyof TabParamList);
    } else if (route === 'Sintomas') {
      stackNav.navigate('Sintomas');
    } else if (route === 'QuickRegisterModal') {
      stackNav.navigate('QuickRegisterModal');
    } else {
      Alert.alert(route, 'Esta seção estará disponível em breve.');
    }
  };

  const handleContentPress = () => tabNav.navigate('Conteudos');

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        onMenuPress={handleMenuPress}
        actions={[
          {
            icon: 'notifications-outline',
            onPress: handleNotifications,
            accessibilityLabel: 'Notificações',
            badgeCount: 3,
          },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <CycleBanner
            cycleDay={cycleData?.day}
            phase={cycleData?.phase}
            onConfigurePress={handleConfigureCycle}
          />
        </View>

        <View style={styles.section}>
          <TodaySummary data={summaryData} onViewAll={handleViewAll} />
        </View>

        <View style={styles.section}>
          <QuickAccess items={QUICK_ACCESS_ITEMS} onItemPress={handleQuickAccess} />
        </View>

        <View style={styles.section}>
          <HealthContentCard
            title={contentData?.title ?? ''}
            description={contentData?.description ?? ''}
            imageSource={contentData?.imageSource}
            imageAccessibilityLabel={contentData?.imageAlt ?? 'Imagem de saúde'}
            onPress={handleContentPress}
            isLoading={isLoading}
            hasError={hasError}
            onRetry={retry}
          />
        </View>
      </ScrollView>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeScreen="Hoje"
      />
      <NotificationsPanel
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
      />
      <DayDetailPanel
        visible={dayDetailVisible}
        onClose={() => setDayDetailVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
