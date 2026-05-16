/**
 * RegisterScreen — Tela de Cadastro
 * Minha Saúde Feminina
 *
 * Formulário de criação de conta com:
 *  - Nome completo
 *  - E-mail
 *  - Senha + confirmação
 *  - Data de nascimento
 *  - Botão "Criar conta"
 *  - Link para voltar ao login
 */

import React, { useState } from 'react';
import {
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

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface FormErrors {
  name?: string;
  email?: string;
  birthDate?: string;
  password?: string;
  confirmPassword?: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // ── Birth date mask (DD/MM/AAAA) ──────────────────────────────────────

  const handleBirthDate = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let masked = digits;
    if (digits.length > 2) masked = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) masked = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    setBirthDate(masked);
    setErrors(e => ({ ...e, birthDate: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!name.trim()) e.name = 'Informe seu nome completo.';
    else if (name.trim().split(' ').length < 2) e.name = 'Informe nome e sobrenome.';

    if (!email.trim()) e.email = 'Informe seu e-mail.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'E-mail inválido.';

    if (!birthDate || birthDate.length < 10) e.birthDate = 'Informe sua data de nascimento.';

    if (!password) e.password = 'Crie uma senha.';
    else if (password.length < 6) e.password = 'A senha deve ter pelo menos 6 caracteres.';

    if (!confirmPassword) e.confirmPassword = 'Confirme sua senha.';
    else if (confirmPassword !== password) e.confirmPassword = 'As senhas não coincidem.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleRegister = () => {
    if (!validate()) return;
    setLoading(true);
    // Simula criação de conta — substituir por chamada real à API
    setTimeout(() => {
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }, 1000);
  };

  const handleBackToLogin = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBackToLogin}
          style={styles.topBarBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para login"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Minha Saúde Feminina</Text>
        <View style={{ width: 36 }} />
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
            <Text style={styles.cardTitle}>Criar conta</Text>
            <Text style={styles.cardSubtitle}>
              Preencha os dados abaixo para começar a cuidar da sua saúde.
            </Text>

            {/* Nome */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nome completo</Text>
              <View style={[styles.inputWrap, errors.name ? styles.inputWrapError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor={Colors.textDisabled}
                  value={name}
                  onChangeText={(t) => { setName(t); setErrors(e => ({ ...e, name: undefined })); }}
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityLabel="Campo nome completo"
                />
              </View>
              {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}
            </View>

            {/* E-mail */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>E-mail</Text>
              <View style={[styles.inputWrap, errors.email ? styles.inputWrapError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={Colors.textDisabled}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  accessibilityLabel="Campo de e-mail"
                />
              </View>
              {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
            </View>

            {/* Data de nascimento */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Data de nascimento</Text>
              <View style={[styles.inputWrap, errors.birthDate ? styles.inputWrapError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={Colors.textDisabled}
                  value={birthDate}
                  onChangeText={handleBirthDate}
                  keyboardType="numeric"
                  returnKeyType="next"
                  accessibilityLabel="Campo data de nascimento"
                />
              </View>
              {errors.birthDate ? <Text style={styles.fieldError}>{errors.birthDate}</Text> : null}
            </View>

            {/* Senha */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Senha</Text>
              <View style={[styles.inputWrap, errors.password ? styles.inputWrapError : null]}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.textDisabled}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
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
              {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
            </View>

            {/* Confirmar senha */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirmar senha</Text>
              <View style={[styles.inputWrap, errors.confirmPassword ? styles.inputWrapError : null]}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Repita a senha"
                  placeholderTextColor={Colors.textDisabled}
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setErrors(e => ({ ...e, confirmPassword: undefined })); }}
                  secureTextEntry={!showConfirm}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  accessibilityLabel="Campo confirmar senha"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(v => !v)}
                  style={styles.eyeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.fieldError}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Botão Criar conta */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Criar conta"
            >
              <Text style={styles.btnPrimaryText}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Já tenho conta */}
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={handleBackToLogin}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Já tenho uma conta"
            >
              <Text style={styles.btnOutlineText}>Já tenho uma conta</Text>
            </TouchableOpacity>
          </View>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
