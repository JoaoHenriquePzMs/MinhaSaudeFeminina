/**
 * HealthContentCard — Card de Conteúdo de Saúde
 * Minha Saúde Feminina
 *
 * Displays a health article card with title, description and a 1:1 image.
 * Supports loading (skeleton), error and broken-image states.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 9.2
 */

import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SkeletonPlaceholder from '../common/SkeletonPlaceholder';
import ErrorMessage from '../common/ErrorMessage';
import { Colors, Spacing } from '../../theme';
import { styles, IMAGE_SIZE } from './HealthContentCard.styles';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HealthContentCardProps {
  /** Article title — truncated at 60 chars (Req 6.1). */
  title: string;
  /** Article description — limited to 2 visible lines (Req 6.2). */
  description: string;
  /** Optional image source for the 1:1 thumbnail (Req 6.3). */
  imageSource?: ImageSourcePropType;
  /** Descriptive accessibility label for the image (Req 6.7, 9.2). */
  imageAccessibilityLabel: string;
  /** Called when the user taps the card (Req 6.5). */
  onPress: () => void;
  /** When true, renders skeleton placeholders instead of content (Req 6.8). */
  isLoading?: boolean;
  /** When true, renders an error message with a retry option (Req 6.9). */
  hasError?: boolean;
  /** Called when the user taps "Tentar novamente" in the error state (Req 6.9). */
  onRetry?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * HealthContentCard
 *
 * Rendering states:
 * - **Loading** (`isLoading`): skeleton placeholders for title, description and image.
 * - **Error** (`hasError`): `ErrorMessage` component with optional retry callback.
 * - **Normal**: title (1 line, truncated), description (2 lines, truncated), image 80×80dp.
 * - **Broken image**: placeholder `View` with a `heart-outline` Ionicons icon.
 */
const HealthContentCard: React.FC<HealthContentCardProps> = ({
  title,
  description,
  imageSource,
  imageAccessibilityLabel,
  onPress,
  isLoading = false,
  hasError = false,
  onRetry,
}) => {
  // Track whether the image failed to load (Req 6.4)
  const [imageError, setImageError] = useState(false);

  // ─── Loading state (Req 6.8) ──────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {/* Text skeletons */}
        <View style={styles.skeletonTextBlock}>
          <SkeletonPlaceholder width="80%" height={16} borderRadius={4} />
          <SkeletonPlaceholder
            width="60%"
            height={12}
            borderRadius={4}
            style={{ marginTop: Spacing.xs }}
          />
          <SkeletonPlaceholder
            width="90%"
            height={12}
            borderRadius={4}
            style={{ marginTop: Spacing.xs }}
          />
        </View>

        {/* Image skeleton */}
        <SkeletonPlaceholder
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          borderRadius={8}
        />
      </View>
    );
  }

  // ─── Error state (Req 6.9) ────────────────────────────────────────────
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage
          message="Não foi possível carregar o conteúdo."
          onRetry={onRetry}
        />
      </View>
    );
  }

  // ─── Normal state ─────────────────────────────────────────────────────
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"          // Req 9.2
      accessibilityLabel={`${title}. ${description}`}
    >
      {/* Text area */}
      <View style={styles.textContainer}>
        {/* Req 6.1 — title truncated at 60 chars via numberOfLines={1} */}
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          allowFontScaling
          maxFontSizeMultiplier={2}
        >
          {title}
        </Text>

        {/* Req 6.2 — description limited to 2 lines */}
        <Text
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
          allowFontScaling
          maxFontSizeMultiplier={2}
        >
          {description}
        </Text>
      </View>

      {/* Image area — Req 6.3, 6.4, 6.7 */}
      {imageSource && !imageError ? (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={imageAccessibilityLabel}  // Req 6.7
          accessible
          onError={() => setImageError(true)}           // Req 6.4
        />
      ) : (
        /* Broken-image / no-image placeholder — Req 6.4 */
        <View
          style={styles.imagePlaceholder}
          accessible
          accessibilityLabel={imageAccessibilityLabel}
        >
          <Ionicons
            name="heart-outline"
            size={32}
            color={Colors.primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default HealthContentCard;
