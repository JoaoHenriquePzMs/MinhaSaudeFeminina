/**
 * QuickRegisterModal — Registro Rápido
 * Minha Saúde Feminina
 *
 * Bottom sheet acionado pelo FAB central. Permite registrar rapidamente:
 *  - Humor do dia (5 opções com emoji)
 *  - Sintomas principais (chips selecionáveis)
 *  - Observação livre (opcional)
 *
 * Requirements: 7.5
 */

import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';

// ─── Data ─────────────────────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  { id: 'otima',     label: 'Ótima',    emoji: '😄' },
  { id: 'bem',       label: 'Bem',      emoji: '🙂' },
  { id: 'neutra',    label: 'Neutra',   emoji: '😐' },
  { id: 'mal',       label: 'Mal',      emoji: '😔' },
  { id: 'muito_mal', label: 'Muito mal',emoji: '😢' },
];

const QUICK_SYMPTOMS = [
  { id: 'colica',         label: 'Cólica',        icon: 'body-outline' },
  { id: 'dor_cabeca',     label: 'Dor de cabeça', icon: 'medical-outline' },
  { id: 'cansaço',        label: 'Cansaço',       icon: 'bed-outline' },
  { id: 'inchaço',        label: 'Inchaço',       icon: 'water-outline' },
  { id: 'irritabilidade', label: 'Irritação',     icon: 'flash-outline' },
  { id: 'nausea',         label: 'Náusea',        icon: 'alert-circle-outline' },
  { id: 'sangramento',    label: 'Sangramento',   icon: 'water' },
  { id: 'sem_sintomas',   label: 'Sem sintomas',  icon: 'checkmark-circle-outline' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const QuickRegisterModal: React.FC = () => {
  const navigation = useNavigation();

  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!selectedMood && selectedSymptoms.length === 0) {
      Alert.alert(
        'Nada selecionado',
        'Selecione pelo menos seu humor ou um sintoma para salvar.',
      );
      return;
    }

    setSaving(true);
    // Simula gravação — substituir por persistência real
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        '✓ Registro salvo!',
        'Seu registro rápido foi salvo com sucesso.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }, 600);
  };

  const handleClose = () => navigation.goBack();

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <View style={s.header}>
        <View style={s.headerLeft} />
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Registro Rápido</Text>
          <Text style={s.headerDate}>{today}</Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          style={s.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        >
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Humor ────────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Como você está hoje?</Text>
          <View style={s.moodRow}>
            {MOOD_OPTIONS.map(m => {
              const active = selectedMood === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[s.moodItem, active && s.moodItemActive]}
                  onPress={() => setSelectedMood(active ? '' : m.id)}
                  accessibilityRole="button"
                  accessibilityLabel={m.label}
                  accessibilityState={{ selected: active }}
                  activeOpacity={0.75}
                >
                  <Text style={s.moodEmoji}>{m.emoji}</Text>
                  <Text style={[s.moodLabel, active && s.moodLabelActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Sintomas ─────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sintomas</Text>
          <Text style={s.sectionSub}>Selecione os que se aplicam hoje</Text>
          <View style={s.chipsWrap}>
            {QUICK_SYMPTOMS.map(sym => {
              const active = selectedSymptoms.includes(sym.id);
              return (
                <TouchableOpacity
                  key={sym.id}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => toggleSymptom(sym.id)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={sym.label}
                  accessibilityState={{ checked: active }}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={sym.icon as React.ComponentProps<typeof Ionicons>['name']}
                    size={14}
                    color={active ? Colors.textOnPrimary : Colors.primary}
                  />
                  <Text style={[s.chipText, active && s.chipTextActive]}>
                    {sym.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Observação ───────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Observação <Text style={s.optional}>(opcional)</Text></Text>
          <TextInput
            style={s.noteInput}
            placeholder="Como você está se sentindo? Algum detalhe importante..."
            placeholderTextColor={Colors.textDisabled}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            accessibilityLabel="Campo de observação"
          />
        </View>

        {/* ── Aviso ────────────────────────────────────────────────── */}
        <View style={s.disclaimer}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textSecondary} />
          <Text style={s.disclaimerText}>
            Este registro é pessoal e não substitui avaliação médica.
          </Text>
        </View>
      </ScrollView>

      {/* ── Footer com botões ────────────────────────────────────── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          activeOpacity={0.75}
        >
          <Text style={s.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.saveBtn, saving && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Salvar registro"
          activeOpacity={0.85}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={Colors.textOnPrimary}
          />
          <Text style={s.saveBtnText}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },
  headerDate: {
    fontSize: Typography.fontSizeCaption,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },

  // Section
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionSub: {
    fontSize: Typography.fontSizeCaption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
  },
  optional: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textDisabled,
  },

  // Mood
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.button,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  moodItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfacePink,
  },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  moodLabelActive: { color: Colors.primary },

  // Chips
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.textOnPrimary,
  },

  // Note input
  noteInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    fontSize: Typography.fontSizeBody,
    color: Colors.textPrimary,
    minHeight: 88,
    lineHeight: Typography.lineHeightBody,
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.fontSizeCaption,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightCaption + 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.button,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minHeight: 48,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.primary,
  },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
  },
});

export default QuickRegisterModal;
