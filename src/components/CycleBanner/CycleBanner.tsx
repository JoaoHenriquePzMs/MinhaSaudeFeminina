/**
 * CycleBanner — Banner do Ciclo Menstrual
 * Minha Saúde Feminina
 *
 * Displays the current menstrual cycle phase when configured, or a CTA to
 * configure the cycle when not configured.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 9.2
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme';
import { styles } from './CycleBanner.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Valid menstrual cycle phases — Requirement 3.3 */
export type CyclePhase =
  | 'FASE MENSTRUAL'
  | 'FASE FOLICULAR'
  | 'FASE OVULATÓRIA'
  | 'FASE LÚTEA';

export interface CycleBannerProps {
  /** Current cycle day (1–35). Undefined means the cycle is not configured. */
  cycleDay?: number;
  /** Current cycle phase. Undefined means the cycle is not configured. */
  phase?: CyclePhase;
  /** Callback fired when the user presses "Configurar agora". */
  onConfigurePress?: () => void;
}

// ─── Gradient configuration ───────────────────────────────────────────────────

/** Left-to-right gradient — Requirement 3.1 */
const GRADIENT_COLORS: [string, string] = [Colors.gradientStart, Colors.gradientEnd];
const GRADIENT_START = { x: 0, y: 0.5 };
const GRADIENT_END = { x: 1, y: 0.5 };

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CycleBanner
 *
 * - **Configured state** (`cycleDay` and `phase` are defined):
 *   Shows "Você está no Xº dia do ciclo" and a badge with the phase name.
 * - **Unconfigured state** (`cycleDay` or `phase` is undefined):
 *   Shows a CTA message and a "Configurar agora" button.
 */
const CycleBanner: React.FC<CycleBannerProps> = ({
  cycleDay,
  phase,
  onConfigurePress,
}) => {
  const isConfigured = cycleDay !== undefined && phase !== undefined;

  // ─── Accessibility ──────────────────────────────────────────────────────
  // Requirement 3.7, 9.2
  const accessibilityLabel = isConfigured
    ? `Você está no ${cycleDay}º dia do ciclo. ${phase}.`
    : 'Ciclo não configurado. Toque para configurar.';

  // ─── Configured state ───────────────────────────────────────────────────
  if (isConfigured) {
    return (
      <View
        style={styles.container}
        accessible
        accessibilityRole="summary"          // Requirement 3.7
        accessibilityLabel={accessibilityLabel}
      >
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.gradient}
        >
          {/* Requirement 3.2 — day text */}
          <Text
            style={styles.dayText}
            allowFontScaling
            maxFontSizeMultiplier={2}
          >
            {`Você está no ${cycleDay}º dia do ciclo`}
          </Text>

          {/* Requirement 3.3 — phase badge in uppercase */}
          <View style={styles.badge}>
            <Text
              style={styles.badgeText}
              allowFontScaling
              maxFontSizeMultiplier={2}
            >
              {phase}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // ─── Unconfigured state ─────────────────────────────────────────────────
  // Requirement 3.6
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={styles.gradient}
      >
        {/* CTA message */}
        <Text
          style={styles.ctaText}
          allowFontScaling
          maxFontSizeMultiplier={2}
        >
          Configure seu ciclo para ver informações personalizadas
        </Text>

        {/* "Configurar agora" button — Requirement 9.2, 9.3 */}
        <TouchableOpacity
          style={styles.configureButton}
          onPress={onConfigurePress}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
        >
          <Text
            style={styles.configureButtonText}
            allowFontScaling
            maxFontSizeMultiplier={2}
          >
            Configurar agora
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default CycleBanner;
