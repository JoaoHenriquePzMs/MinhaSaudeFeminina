/**
 * SintomasScreen — Registro de Sintomas
 * Minha Saúde Feminina
 *
 * Tela de registro de sintomas acessada pelo Acesso Rápido.
 * Permite selecionar sintomas do dia e adicionar observações.
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

// ─── Symptom options ──────────────────────────────────────────────────────────

const SYMPTOM_OPTIONS = [
  { id: 'colica',        label: 'Cólica',              icon: 'body-outline' },
  { id: 'dor_cabeca',    label: 'Dor de cabeça',       icon: 'medical-outline' },
  { id: 'inchaço',       label: 'Inchaço',             icon: 'water-outline' },
  { id: 'cansaço',       label: 'Cansaço',             icon: 'bed-outline' },
  { id: 'irritabilidade',label: 'Irritabilidade',      icon: 'flash-outline' },
  { id: 'ansiedade',     label: 'Ansiedade',           icon: 'pulse-outline' },
  { id: 'acne',          label: 'Acne',                icon: 'ellipse-outline' },
  { id: 'nausea',        label: 'Náusea',              icon: 'alert-circle-outline' },
  { id: 'sangramento',   label: 'Sangramento',         icon: 'water' },
  { id: 'corrimento',    label: 'Corrimento',          icon: 'droplet-outline' },
  { id: 'dor_seios',     label: 'Dor nos seios',       icon: 'heart-outline' },
  { id: 'sem_sintomas',  label: 'Sem sintomas',        icon: 'checkmark-circle-outline' },
];

const MOOD_OPTIONS = [
  { id: 'otima',      label: 'Ótima',       emoji: '😄' },
  { id: 'bem',        label: 'Bem',         emoji: '🙂' },
  { id: 'neutra',     label: 'Neutra',      emoji: '😐' },
  { id: 'mal',        label: 'Mal',         emoji: '😔' },
  { id: 'muito_mal',  label: 'Muito mal',   emoji: '😢' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SintomasScreen: React.FC = () => {
  const navigation = useNavigation();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState('');

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedSymptoms.length === 0 && !selectedMood) {
      Alert.alert('Atenção', 'Selecione pelo menos um sintoma ou humor antes de salvar.');
      return;
    }
    Alert.alert(
      'Registro salvo!',
      'Seus sintomas foram registrados com sucesso.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Registrar Sintomas</Text>
          <Text style={s.headerDate}>{today}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Humor ────────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Como você está se sentindo?</Text>
          <View style={s.moodRow}>
            {MOOD_OPTIONS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[s.moodItem, selectedMood === m.id && s.moodItemActive]}
                onPress={() => setSelectedMood(m.id)}
                accessibilityRole="button"
                accessibilityLabel={m.label}
                accessibilityState={{ selected: selectedMood === m.id }}
              >
                <Text style={s.moodEmoji}>{m.emoji}</Text>
                <Text style={[s.moodLabel, selectedMood === m.id && s.moodLabelActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Sintomas ─────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sintomas de hoje</Text>
          <Text style={s.sectionSubtitle}>Selecione todos que se aplicam</Text>
          <View style={s.symptomsGrid}>
            {SYMPTOM_OPTIONS.map(sym => {
              const active = selectedSymptoms.includes(sym.id);
              return (
                <TouchableOpacity
                  key={sym.id}
                  style={[s.symptomChip, active && s.symptomChipActive]}
                  onPress={() => toggleSymptom(sym.id)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={sym.label}
                  accessibilityState={{ checked: active }}
                >
                  <Ionicons
                    name={sym.icon as React.ComponentProps<typeof Ionicons>['name']}
                    size={16}
                    color={active ? Colors.textOnPrimary : Colors.primary}
                  />
                  <Text style={[s.symptomLabel, active && s.symptomLabelActive]}>
                    {sym.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Observações ──────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Observações</Text>
          <TextInput
            style={s.notesInput}
            placeholder="Adicione detalhes sobre como você está se sentindo hoje..."
            placeholderTextColor={Colors.textDisabled}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Campo de observações"
          />
        </View>

        {/* ── Aviso ────────────────────────────────────────────────── */}
        <View style={s.warning}>
          <Ionicons name="warning-outline" size={14} color={Colors.warning} />
          <Text style={s.warningText}>
            Este registro é apenas para acompanhamento pessoal e não substitui avaliação médica.
          </Text>
        </View>

        {/* ── Salvar ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={s.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Salvar registro de sintomas"
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={Colors.textOnPrimary} />
          <Text style={s.saveBtnText}>Salvar registro</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary },
  headerDate: { fontSize: Typography.fontSizeCaption, color: Colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },

  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },

  section: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.card,
    padding: Spacing.base, marginBottom: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  sectionSubtitle: { fontSize: Typography.fontSizeCaption, color: Colors.textSecondary, marginBottom: Spacing.md },

  // Mood
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.button, borderWidth: 1.5, borderColor: Colors.border,
    marginHorizontal: 3,
  },
  moodItemActive: { borderColor: Colors.primary, backgroundColor: Colors.surfacePink },
  moodEmoji: { fontSize: 22, marginBottom: 4 },
  moodLabel: { fontSize: 10, fontWeight: Typography.fontWeightMedium, color: Colors.textSecondary, textAlign: 'center' },
  moodLabelActive: { color: Colors.primary },

  // Symptoms grid
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  symptomChip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  symptomChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  symptomLabel: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightMedium, color: Colors.textPrimary },
  symptomLabelActive: { color: Colors.textOnPrimary },

  // Notes
  notesInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.button,
    padding: Spacing.md, fontSize: Typography.fontSizeBody, color: Colors.textPrimary,
    minHeight: 100, lineHeight: Typography.lineHeightBody,
  },

  // Warning
  warning: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs,
    backgroundColor: '#FFF8E1', borderRadius: BorderRadius.button,
    padding: Spacing.md, marginBottom: Spacing.base,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  warningText: { flex: 1, fontSize: Typography.fontSizeCaption, color: Colors.textSecondary, lineHeight: Typography.lineHeightCaption + 2 },

  // Save button
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.button,
    minHeight: 52, marginBottom: Spacing.base,
  },
  saveBtnText: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textOnPrimary },
});

export default SintomasScreen;
