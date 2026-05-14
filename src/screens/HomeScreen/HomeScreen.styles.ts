/**
 * HomeScreen — Styles
 * Minha Saúde Feminina
 *
 * Requirements: 8.1, 8.2, 8.3, 10.1, 10.2, 10.3
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../theme';

export const styles = StyleSheet.create({
  /** Root container — fills the screen and applies the app background color. */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /** ScrollView itself — fills remaining space below the Header. */
  scrollView: {
    flex: 1,
  },

  /**
   * Inner content container for the ScrollView.
   * Horizontal padding: 16dp (Spacing.base).
   * Vertical padding: 16dp top and bottom.
   * Gap between sections is achieved via marginBottom on each section wrapper.
   */
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
  },

  /** Wrapper applied to every section to create 16dp vertical spacing. */
  section: {
    marginBottom: Spacing.base,
  },
});
