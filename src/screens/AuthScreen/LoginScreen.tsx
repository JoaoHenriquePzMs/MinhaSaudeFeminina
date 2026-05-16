/**
 * LoginScreen — Tela de Login
 * Minha Saúde Feminina
 *
 * Layout inspirado no padrão da referência:
 *  - Card central com campos de e-mail e senha
 *  - Botão primário "Entrar"
 *  - Link "Esqueci minha senha"
 *  - Divisor "ou"
 *  - Botão outline "Criar conta"
 */

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './AuthScreen.styles';
import { Colors } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────

  const validate = (): boolean => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Informe seu e-mail.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('E-mail inválido.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Informe sua senha.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      valid = false;
    }

    return valid;
  };

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    // Simula autenticação — substituir por chamada real à API
    setTimeout(() => {
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar senha',
      'Um link de recuperação será enviado para o seu e-mail cadastrado.',
      [{ text: 'OK' }],
    );
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Minha Saúde Feminina</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Card ──────────────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acessar conta</Text>

            {/* E-mail */}
            <View style={styles.fieldGroup}>
              <View style={[styles.inputWrap, emailError ? styles.inputWrapError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={Colors.textDisabled}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  accessibilityLabel="Campo de e-mail"
                />
              </View>
              {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
            </View>

            {/* Senha */}
            <View style={styles.fieldGroup}>
              <View style={[styles.inputWrap, passwordError ? styles.inputWrapError : null]}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Senha"
                  placeholderTextColor={Colors.textDisabled}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  accessibilityLabel="Campo de senha"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  style={styles.eyeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Entrar na conta"
            >
              {loading ? (
                <Text style={styles.btnPrimaryText}>Entrando...</Text>
              ) : (
                <Text style={styles.btnPrimaryText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Esqueci senha */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotBtn}
              accessibilityRole="button"
              accessibilityLabel="Esqueci minha senha"
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Criar conta */}
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={handleCreateAccount}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Criar nova conta"
            >
              <Text style={styles.btnOutlineText}>Criar conta</Text>
            </TouchableOpacity>
          </View>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
