/**
 * ContentsScreen — Tela de Conteúdos
 * Minha Saúde Feminina
 *
 * Exibe artigos de saúde feminina com:
 *  - Barra de pesquisa funcional (filtra por título e descrição)
 *  - Hero banner com filtro por categoria
 *  - Lista de artigos com cards clicáveis
 *  - Modal de detalhe com conteúdo completo
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import MenuDrawer from '../../components/common/MenuDrawer';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { styles } from './ContentsScreen.styles';
import { HEALTH_ARTICLES, ARTICLE_CATEGORIES } from '../../data/mockData';
import { HealthArticle } from '../../data/types';

// ─── Article Detail Modal ─────────────────────────────────────────────────────

interface ArticleDetailProps {
  article: HealthArticle;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const { content } = article;

  return (
    <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.modalCloseButton}
          accessibilityRole="button"
          accessibilityLabel="Fechar artigo"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.modalHeaderCategory}>{article.category}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.modalScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.modalScrollContent}
      >
        <View style={styles.modalTitleBlock}>
          <View style={styles.modalIconCircle}>
            <Ionicons
              name={article.icon as React.ComponentProps<typeof Ionicons>['name']}
              size={32}
              color={Colors.textOnPrimary}
            />
          </View>
          <Text style={styles.modalTitle}>{article.title}</Text>
          <Text style={styles.modalDescription}>{article.description}</Text>
        </View>

        {content.intro ? (
          <View style={styles.modalSection}>
            <Text style={styles.modalBodyText}>{content.intro}</Text>
          </View>
        ) : null}

        {content.whatIsNormal && content.whatIsNormal.length > 0 ? (
          <View style={styles.modalSection}>
            <View style={styles.modalSectionHeader}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.modalSectionTitle}>O que é normal</Text>
            </View>
            {content.whatIsNormal.map((item, i) => (
              <View key={i} style={styles.modalBulletRow}>
                <View style={[styles.modalBulletDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.modalBulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {content.whatIsNotNormal && content.whatIsNotNormal.length > 0 ? (
          <View style={styles.modalSection}>
            <View style={styles.modalSectionHeader}>
              <Ionicons name="alert-circle" size={20} color={Colors.warning} />
              <Text style={styles.modalSectionTitle}>Fique atenta</Text>
            </View>
            {content.whatIsNotNormal.map((item, i) => (
              <View key={i} style={styles.modalBulletRow}>
                <View style={[styles.modalBulletDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.modalBulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {content.whenToSeekHelp && content.whenToSeekHelp.length > 0 ? (
          <View style={styles.modalSection}>
            <View style={styles.modalSectionHeader}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.modalSectionTitle}>Quando procurar a UBS</Text>
            </View>
            {content.whenToSeekHelp.map((item, i) => (
              <View key={i} style={styles.modalBulletRow}>
                <View style={[styles.modalBulletDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.modalBulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {content.whatToDoAtHome && content.whatToDoAtHome.length > 0 ? (
          <View style={styles.modalSection}>
            <View style={styles.modalSectionHeader}>
              <Ionicons name="home" size={20} color={Colors.info} />
              <Text style={styles.modalSectionTitle}>O que você pode fazer em casa</Text>
            </View>
            {content.whatToDoAtHome.map((item, i) => (
              <View key={i} style={styles.modalBulletRow}>
                <View style={[styles.modalBulletDot, { backgroundColor: Colors.info }]} />
                <Text style={styles.modalBulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {content.warning ? (
          <View style={styles.modalWarning}>
            <Ionicons name="warning" size={18} color={Colors.warning} />
            <Text style={styles.modalWarningText}>{content.warning}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Search bar ───────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => (
  <View style={searchStyles.wrap}>
    <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
    <TextInput
      style={searchStyles.input}
      placeholder="Buscar artigos..."
      placeholderTextColor={Colors.textDisabled}
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      autoCorrect={false}
      autoCapitalize="none"
      accessibilityLabel="Buscar artigos de saúde"
    />
    {value.length > 0 && (
      <TouchableOpacity
        onPress={onClear}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Limpar busca"
      >
        <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    )}
  </View>
);

const searchStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizeBody,
    color: Colors.textPrimary,
    paddingVertical: 0,
    minHeight: 36,
  },
});

// ─── Highlight matching text ──────────────────────────────────────────────────

const HighlightText: React.FC<{
  text: string;
  query: string;
  style: object;
  highlightStyle: object;
  numberOfLines?: number;
}> = ({ text, query, style, highlightStyle, numberOfLines }) => {
  if (!query.trim()) {
    return <Text style={style} numberOfLines={numberOfLines}>{text}</Text>;
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <Text key={i} style={highlightStyle}>{part}</Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ContentsScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;

  // ── Filter logic ──────────────────────────────────────────────────────

  const filteredArticles = useMemo(() => {
    let list = HEALTH_ARTICLES;

    // Category filter
    if (activeCategory !== 'Todos') {
      list = list.filter(a => a.categoryKey === activeCategory);
    }

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.content.intro ?? '').toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  // ── Search toggle ─────────────────────────────────────────────────────

  const toggleSearch = () => {
    if (searchVisible) {
      // Close
      Animated.timing(searchAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start(() => {
        setSearchVisible(false);
        setSearchQuery('');
      });
    } else {
      setSearchVisible(true);
      Animated.timing(searchAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleMenuPress = () => setMenuVisible(true);

  // ── Section label ─────────────────────────────────────────────────────

  const sectionLabel = (() => {
    if (searchQuery.trim()) return `Resultados para "${searchQuery.trim()}"`;
    if (activeCategory === 'Todos') return 'Todos os Artigos';
    return activeCategory;
  })();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        onMenuPress={handleMenuPress}
        actions={[
          {
            icon: searchVisible ? 'close-outline' : 'search-outline',
            onPress: toggleSearch,
            accessibilityLabel: searchVisible ? 'Fechar busca' : 'Buscar conteúdos',
          },
        ]}
      />

      {/* ── Search bar (animated) ─────────────────────────────────── */}
      {searchVisible && (
        <Animated.View style={{ opacity: searchAnim }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={handleClearSearch}
          />
        </Animated.View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ── Hero banner (hidden during search) ───────────────────── */}
        {!searchQuery.trim() && (
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.heroBanner}
          >
            <Text style={styles.heroCategory}>EDUCAÇÃO E SAÚDE</Text>
            <Text style={styles.heroTitle}>Saúde Feminina</Text>
            <Text style={styles.heroSubtitle}>
              Informação segura para sua saúde e bem-estar
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {ARTICLE_CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setActiveCategory(cat)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={cat}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </LinearGradient>
        )}

        {/* ── Article list ─────────────────────────────────────────── */}
        <View style={styles.contentArea}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} numberOfLines={1}>{sectionLabel}</Text>
            <Text style={styles.seeAllText}>
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'}
            </Text>
          </View>

          {/* Empty state */}
          {filteredArticles.length === 0 && (
            <View style={emptyStyles.wrap}>
              <Ionicons name="search-outline" size={48} color={Colors.textDisabled} />
              <Text style={emptyStyles.title}>Nenhum resultado</Text>
              <Text style={emptyStyles.sub}>
                Tente buscar por outro termo ou selecione uma categoria diferente.
              </Text>
            </View>
          )}

          {filteredArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => setSelectedArticle(article)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${article.title}. ${article.description}. Toque para ler mais.`}
            >
              <View style={styles.articleImagePlaceholder}>
                <Ionicons
                  name={article.icon as React.ComponentProps<typeof Ionicons>['name']}
                  size={40}
                  color={Colors.primaryLight}
                />
              </View>

              <View style={styles.articleBody}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <HighlightText
                  text={article.title}
                  query={searchQuery}
                  style={styles.articleTitle}
                  highlightStyle={{ backgroundColor: '#FFF176', color: Colors.textPrimary }}
                  numberOfLines={2}
                />
                <HighlightText
                  text={article.description}
                  query={searchQuery}
                  style={styles.articleDescription}
                  highlightStyle={{ backgroundColor: '#FFF9C4', color: Colors.textSecondary }}
                  numberOfLines={2}
                />
                <Text style={styles.readMoreText}>Ler mais +</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* ── Disclaimer banner ────────────────────────────────────── */}
          {filteredArticles.length > 0 && (
            <View style={styles.faqBanner}>
              <Text style={styles.faqTitle}>Lembre-se sempre</Text>
              <Text style={styles.faqSubtitle}>
                As informações deste app não substituem avaliação médica. Procure sempre a UBS para confirmação e tratamento adequado.
              </Text>
              <View style={styles.faqUBSRow}>
                <Ionicons name="location-outline" size={16} color={Colors.primary} />
                <Text style={styles.faqUBSText}>Encontre sua UBS mais próxima</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Article Detail Modal ─────────────────────────────────────── */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        ) : null}
      </Modal>

      {/* ── Menu Drawer ──────────────────────────────────────────────── */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeScreen="Conteudos"
      />
    </SafeAreaView>
  );
};

const emptyStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textSecondary,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  sub: {
    fontSize: Typography.fontSizeBody,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: Typography.lineHeightBody,
  },
});

export default ContentsScreen;
