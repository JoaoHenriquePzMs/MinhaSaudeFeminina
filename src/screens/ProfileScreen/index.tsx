/**
 * ProfileScreen — Tela de Perfil
 * Minha Saúde Feminina
 *
 * Seções:
 *  - Avatar + nome + e-mail (com botão editar)
 *  - Estatísticas do ciclo (ciclos registrados, regularidade, duração média)
 *  - Histórico de humor dos últimos 30 dias (grid de emojis por data)
 *  - Informações do ciclo (duração, período, última menstruação)
 *  - Configurações (notificações toggle, compartilhar dados toggle)
 *  - Botão sair
 */

import React, { useState, useMemo } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import MenuDrawer from '../../components/common/MenuDrawer';
import { MOCK_CYCLE_DATA, MOCK_USER_PROFILE, MOCK_MOOD_HISTORY } from '../../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Mood color map ───────────────────────────────────────────────────────────

const MOOD_COLOR: Record<string, string> = {
  otima:     '#4CAF50',
  bem:       '#8BC34A',
  neutra:    '#FFC107',
  mal:       '#FF7043',
  muito_mal: '#E53935',
};

// ─── Avatar initials ──────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

interface EditProfileModalProps {
  visible: boolean;
  name: string;
  email: string;
  onSave: (name: string, email: string) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible, name: initialName, email: initialEmail, onSave, onClose,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome não pode estar vazio.');
      return;
    }
    onSave(name.trim(), email.trim());
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={editStyles.container} edges={['top', 'bottom']}>
        <View style={editStyles.header}>
          <TouchableOpacity onPress={onClose} style={editStyles.headerBtn} accessibilityRole="button" accessibilityLabel="Cancelar">
            <Text style={editStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={editStyles.headerTitle}>Editar Perfil</Text>
          <TouchableOpacity onPress={handleSave} style={editStyles.headerBtn} accessibilityRole="button" accessibilityLabel="Salvar">
            <Text style={editStyles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={editStyles.content} keyboardShouldPersistTaps="handled">
          {/* Avatar placeholder */}
          <View style={editStyles.avatarWrap}>
            <View style={editStyles.avatar}>
              <Text style={editStyles.avatarInitials}>{getInitials(name || 'U')}</Text>
            </View>
            <TouchableOpacity style={editStyles.avatarEditBtn} accessibilityRole="button" accessibilityLabel="Alterar foto">
              <Ionicons name="camera" size={14} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <View style={editStyles.fieldGroup}>
            <Text style={editStyles.fieldLabel}>Nome completo</Text>
            <View style={editStyles.inputWrap}>
              <TextInput
                style={editStyles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
                accessibilityLabel="Nome completo"
              />
            </View>
          </View>

          <View style={editStyles.fieldGroup}>
            <Text style={editStyles.fieldLabel}>E-mail</Text>
            <View style={editStyles.inputWrap}>
              <TextInput
                style={editStyles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                accessibilityLabel="E-mail"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const editStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerBtn: { minWidth: 60, minHeight: 44, justifyContent: 'center' },
  headerTitle: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary },
  cancelText: { fontSize: Typography.fontSizeBody, color: Colors.textSecondary },
  saveText: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.primary, textAlign: 'right' },
  content: { padding: Spacing.base },
  avatarWrap: { alignItems: 'center', marginBottom: Spacing.xl, marginTop: Spacing.base },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: 32, fontWeight: Typography.fontWeightBold, color: Colors.textOnPrimary },
  avatarEditBtn: {
    position: 'absolute', bottom: 0, right: SCREEN_WIDTH / 2 - 44 - 12,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.surface,
  },
  fieldGroup: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold, color: Colors.textSecondary, marginBottom: Spacing.xs },
  inputWrap: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.md, minHeight: 48, justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  input: { fontSize: Typography.fontSizeBody, color: Colors.textPrimary, paddingVertical: Spacing.sm },
});

// ─── Mood History Grid ────────────────────────────────────────────────────────

const DAYS_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const CELL = Math.floor((SCREEN_WIDTH - Spacing.base * 2 - Spacing.base * 2 - Spacing.sm * 6) / 7);

interface MoodGridProps {
  entries: typeof MOCK_MOOD_HISTORY;
}

const MoodGrid: React.FC<MoodGridProps> = ({ entries }) => {
  // Build a map date → entry
  const map = useMemo(() => {
    const m: Record<string, typeof entries[0]> = {};
    entries.forEach(e => { m[e.date] = e; });
    return m;
  }, [entries]);

  // Build last 5 weeks (35 days) starting from the most recent Sunday
  const today = new Date(2025, 4, 15); // fixed to mock date
  const todayDay = today.getDay(); // 0=Sun
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - todayDay - 28); // go back to 5 weeks ago Sunday

  const cells: { date: string; entry?: typeof entries[0] }[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, entry: map[key] });
  }

  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <View>
      {/* Weekday headers */}
      <View style={moodGridStyles.weekRow}>
        {DAYS_LABELS.map(d => (
          <Text key={d} style={moodGridStyles.weekLabel}>{d}</Text>
        ))}
      </View>

      {/* 5 rows × 7 cols */}
      {Array.from({ length: 5 }).map((_, row) => (
        <View key={row} style={moodGridStyles.row}>
          {cells.slice(row * 7, row * 7 + 7).map((cell, col) => {
            const isToday = cell.date === '2025-05-15';
            const bg = cell.entry ? MOOD_COLOR[cell.entry.moodId] : Colors.divider;
            return (
              <TouchableOpacity
                key={col}
                style={[
                  moodGridStyles.cell,
                  { backgroundColor: bg },
                  isToday && moodGridStyles.todayCell,
                ]}
                onPress={() => {
                  if (cell.entry) {
                    const d = new Date(cell.date + 'T12:00:00');
                    setTooltip(
                      `${d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}: ${cell.entry.emoji} ${cell.entry.label}`
                    );
                    setTimeout(() => setTooltip(null), 2500);
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={
                  cell.entry
                    ? `${cell.date}: ${cell.entry.label}`
                    : `${cell.date}: sem registro`
                }
              />
            );
          })}
        </View>
      ))}

      {/* Tooltip */}
      {tooltip && (
        <View style={moodGridStyles.tooltip}>
          <Text style={moodGridStyles.tooltipText}>{tooltip}</Text>
        </View>
      )}

      {/* Legend */}
      <View style={moodGridStyles.legend}>
        {Object.entries(MOOD_COLOR).map(([id, color]) => {
          const labels: Record<string, string> = {
            otima: 'Ótima', bem: 'Bem', neutra: 'Neutra', mal: 'Mal', muito_mal: 'Muito mal',
          };
          return (
            <View key={id} style={moodGridStyles.legendItem}>
              <View style={[moodGridStyles.legendDot, { backgroundColor: color }]} />
              <Text style={moodGridStyles.legendText}>{labels[id]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const moodGridStyles = StyleSheet.create({
  weekRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  weekLabel: { width: CELL + Spacing.sm, textAlign: 'center', fontSize: 10, color: Colors.textSecondary, fontWeight: Typography.fontWeightSemiBold },
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  cell: { width: CELL, height: CELL, borderRadius: 6 },
  todayCell: { borderWidth: 2, borderColor: Colors.primaryDark },
  tooltip: {
    backgroundColor: Colors.textPrimary, borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    alignSelf: 'center', marginTop: Spacing.sm,
  },
  tooltipText: { color: Colors.textOnPrimary, fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightMedium },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, color: Colors.textSecondary },
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    <View style={s.sectionCard}>{children}</View>
  </View>
);

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon: string;
  iconColor?: string;
  label: string;
  value: string;
  last?: boolean;
}> = ({ icon, iconColor = Colors.primary, label, value, last }) => (
  <View style={[s.infoRow, !last && s.infoRowBorder]}>
    <View style={[s.infoIconWrap, { backgroundColor: iconColor + '18' }]}>
      <Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color={iconColor} />
    </View>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue}>{value}</Text>
  </View>
);

// ─── Setting row ──────────────────────────────────────────────────────────────

const SettingRow: React.FC<{
  icon: string;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  last?: boolean;
}> = ({ icon, label, value, onToggle, last }) => (
  <View style={[s.infoRow, !last && s.infoRowBorder]}>
    <View style={[s.infoIconWrap, { backgroundColor: Colors.primary + '18' }]}>
      <Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color={Colors.primary} />
    </View>
    <Text style={[s.infoLabel, { flex: 1 }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
      thumbColor={value ? Colors.primary : Colors.surface}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
    />
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  // ── State ─────────────────────────────────────────────────────────────
  const [userName, setUserName] = useState(MOCK_USER_PROFILE.name + ' Silva');
  const [userEmail, setUserEmail] = useState('maria.silva@email.com');
  const [editVisible, setEditVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [shareData, setShareData] = useState(false);

  // ── Derived stats ─────────────────────────────────────────────────────
  const registeredCycles = 28;
  const regularity = 72;
  const avgDuration = 5.2;

  const lastPeriod = new Date(MOCK_CYCLE_DATA.startDate).toLocaleDateString('pt-BR');

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSaveProfile = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setEditVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        },
      ],
    );
  };

  const handleMenuPress = () => setMenuVisible(true);

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={handleMenuPress}
          style={s.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Menu"
        >
          <Ionicons name="menu-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Minha Saúde Feminina</Text>
        <TouchableOpacity
          onPress={() => setEditVisible(true)}
          style={s.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
        >
          <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Avatar + nome ────────────────────────────────────────── */}
        <View style={s.avatarSection}>
          <View style={s.avatarOuter}>
            <View style={s.avatar}>
              <Text style={s.avatarInitials}>{getInitials(userName)}</Text>
            </View>
            <TouchableOpacity
              style={s.avatarEditBtn}
              onPress={() => setEditVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Editar perfil"
            >
              <Ionicons name="pencil" size={12} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={s.userName}>{userName}</Text>
          <Text style={s.userEmail}>{userEmail}</Text>
        </View>

        {/* ── Estatísticas ─────────────────────────────────────────── */}
        <Section title="Estatísticas">
          {/* Destaque principal */}
          <View style={s.statHighlight}>
            <View>
              <Text style={s.statHighlightNumber}>{registeredCycles}</Text>
              <Text style={s.statHighlightLabel}>Ciclos registrados</Text>
            </View>
            <View style={s.statHighlightIcon}>
              <Ionicons name="calendar-outline" size={28} color={Colors.primary} />
            </View>
          </View>

          {/* Linha de stats secundários */}
          <View style={s.statRow}>
            <View style={[s.statCard, { marginRight: Spacing.sm }]}>
              <Text style={s.statCardNumber}>{regularity}%</Text>
              <Text style={s.statCardLabel}>Regularidade</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statCardNumber, { color: Colors.primary }]}>{avgDuration}</Text>
              <Text style={s.statCardLabel}>Duração média</Text>
            </View>
          </View>
        </Section>

        {/* ── Histórico de Humor ───────────────────────────────────── */}
        <Section title="Histórico de Humor">
          <Text style={s.moodSubtitle}>Últimos 35 dias · toque para ver detalhes</Text>
          <MoodGrid entries={MOCK_MOOD_HISTORY} />
        </Section>

        {/* ── Informações do Ciclo ─────────────────────────────────── */}
        <Section title="Informações do Ciclo">
          <InfoRow
            icon="sync-outline"
            label="Duração do ciclo"
            value={`${MOCK_CYCLE_DATA.cycleLength} dias`}
          />
          <InfoRow
            icon="water-outline"
            iconColor={Colors.primary}
            label="Duração do período"
            value="5 dias"
          />
          <InfoRow
            icon="calendar-outline"
            iconColor="#9C27B0"
            label="Última menstruação"
            value={lastPeriod}
            last
          />
        </Section>

        {/* ── Configurações ────────────────────────────────────────── */}
        <Section title="Configurações">
          <SettingRow
            icon="notifications-outline"
            label="Notificações"
            value={notificationsOn}
            onToggle={setNotificationsOn}
          />
          <SettingRow
            icon="share-social-outline"
            label="Compartilhar dados"
            value={shareData}
            onToggle={setShareData}
            last
          />
        </Section>

        {/* ── Sair ─────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={s.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={s.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={s.version}>Minha Saúde Feminina · v1.0.0</Text>

      </ScrollView>

      {/* ── Edit Modal ───────────────────────────────────────────────── */}
      <EditProfileModal
        visible={editVisible}
        name={userName}
        email={userEmail}
        onSave={handleSaveProfile}
        onClose={() => setEditVisible(false)}
      />

      {/* ── Menu Drawer ──────────────────────────────────────────────── */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeScreen="Perfil"
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
    zIndex: 1,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },

  scroll: { paddingBottom: Spacing.xxxl },

  // Avatar section
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl, backgroundColor: Colors.surface },
  avatarOuter: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.surfacePink,
  },
  avatarInitials: { fontSize: 36, fontWeight: Typography.fontWeightBold, color: Colors.textOnPrimary },
  avatarEditBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.surface,
  },
  userName: {
    fontSize: Typography.fontSizeLargeTitle,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightLargeTitle,
  },
  userEmail: {
    fontSize: Typography.fontSizeBody,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Section
  section: { marginTop: Spacing.base, paddingHorizontal: Spacing.base },
  sectionTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },

  // Stats
  statHighlight: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.base,
    backgroundColor: Colors.surfacePink,
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.sm,
  },
  statHighlightNumber: {
    fontSize: 40, fontWeight: Typography.fontWeightBold,
    color: Colors.primary, lineHeight: 48,
  },
  statHighlightLabel: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
    marginTop: 2,
  },
  statHighlightIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  statRow: { flexDirection: 'row' },
  statCard: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.divider,
  },
  statCardNumber: {
    fontSize: 28, fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary, lineHeight: 36,
  },
  statCardLabel: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary, marginTop: 2,
  },

  // Mood subtitle
  moodSubtitle: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
    marginBottom: Spacing.md, paddingHorizontal: Spacing.base, paddingTop: Spacing.base,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  infoLabel: { flex: 1, fontSize: Typography.fontSizeBody, color: Colors.textSecondary },
  infoValue: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.button,
    borderWidth: 1.5, borderColor: Colors.error,
    backgroundColor: Colors.surface,
  },
  logoutText: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.error,
  },

  version: {
    textAlign: 'center', fontSize: Typography.fontSizeCaption,
    color: Colors.textDisabled, marginTop: Spacing.lg,
  },
});

export default ProfileScreen;
