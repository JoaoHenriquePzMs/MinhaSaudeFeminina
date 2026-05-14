/**
 * HomeScreen — Tela Principal
 * Minha Saúde Feminina
 *
 * Composes the main home screen in vertical order:
 *   Header → CycleBanner → TodaySummary → QuickAccess → HealthContentCard
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 10.1, 10.2, 10.3
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Header from '../../components/Header';
import CycleBanner from '../../components/CycleBanner';
import TodaySummary from '../../components/TodaySummary';
import QuickAccess from '../../components/QuickAccess';
import HealthContentCard from '../../components/HealthContentCard';

// Hooks
import { useCycleData } from '../../hooks/useCycleData';
import { useTodaySummary } from '../../hooks/useTodaySummary';
import { useHealthContent } from '../../hooks/useHealthContent';

// Data
import { QUICK_ACCESS_ITEMS } from '../../data/mockData';

// Styles
import { styles } from './HomeScreen.styles';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HomeScreen: React.FC = () => {
  // ── Data hooks ────────────────────────────────────────────────────────
  const { cycleData } = useCycleData();
  const { summaryData } = useTodaySummary();
  const { contentData, isLoading, hasError, retry } = useHealthContent();

  // ── Handlers (console.log stubs — Req 8.4, 8.5, 8.6) ─────────────────

  /** Opens the side navigation menu. */
  const handleMenuPress = () => {
    console.log('[HomeScreen] handleMenuPress');
  };

  /** Opens the notifications screen. */
  const handleNotifications = () => {
    console.log('[HomeScreen] handleNotifications');
  };

  /** Opens the cycle configuration flow. */
  const handleConfigureCycle = () => {
    console.log('[HomeScreen] handleConfigureCycle');
  };

  /** Navigates to the full day-detail / summary view. */
  const handleViewAll = () => {
    console.log('[HomeScreen] handleViewAll');
  };

  /**
   * Navigates to the screen associated with the tapped quick-access item.
   * @param route - The route name defined in the QuickAccessItem.
   */
  const handleQuickAccess = (route: string) => {
    console.log('[HomeScreen] handleQuickAccess →', route);
  };

  /** Opens the article detail screen for the featured health content. */
  const handleContentPress = () => {
    console.log('[HomeScreen] handleContentPress');
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    // SafeAreaView handles safe areas on both top and bottom (Req 8.2)
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header sits outside the ScrollView so it stays fixed at the top */}
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

      {/* Scrollable content area (Req 8.3) */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Cycle Banner — Req 8.4 */}
        <View style={styles.section}>
          <CycleBanner
            cycleDay={cycleData?.day}
            phase={cycleData?.phase}
            onConfigurePress={handleConfigureCycle}
          />
        </View>

        {/* 2. Today Summary — Req 8.5 */}
        <View style={styles.section}>
          <TodaySummary data={summaryData} onViewAll={handleViewAll} />
        </View>

        {/* 3. Quick Access — Req 8.6 */}
        <View style={styles.section}>
          <QuickAccess
            items={QUICK_ACCESS_ITEMS}
            onItemPress={handleQuickAccess}
          />
        </View>

        {/* 4. Health Content Card — Req 8.7, 8.8, 8.9 */}
        <View style={styles.section}>
          <HealthContentCard
            title={contentData?.title ?? ''}
            description={contentData?.description ?? ''}
            imageSource={contentData?.imageSource}
            imageAccessibilityLabel={
              contentData?.imageAlt ?? 'Imagem de saúde'
            }
            onPress={handleContentPress}
            isLoading={isLoading}
            hasError={hasError}
            onRetry={retry}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
