/**
 * Mock Data — Minha Saúde Feminina
 *
 * Dados mock para o estado inicial da aplicação.
 * Garante que todos os componentes da Home Screen sejam exibidos
 * com conteúdo no primeiro carregamento, sem depender de APIs externas.
 *
 * Requisitos: 8.7
 */

import { CycleData, TodaySummaryData, HealthContent, UserProfile, QuickAccessItem, HealthArticle } from './types';

// Requisito: 1.2 — Dados do ciclo menstrual da usuária
export const MOCK_CYCLE_DATA: CycleData = {
  day: 14,
  phase: 'FASE OVULATÓRIA',
  cycleLength: 28,
  startDate: '2025-07-01',
};

// Requisito: 4.3, 4.4, 4.5 — Dados do resumo diário
export const MOCK_SUMMARY_DATA: TodaySummaryData = {
  nextPeriodDays: 14,
  mood: 'Bem-disposta',
  dailyTip: 'Beba pelo menos 2 litros de água hoje para manter a hidratação.',
};

// Requisito: 6.1 — Conteúdo de saúde exibido no card
export const MOCK_HEALTH_CONTENT: HealthContent = {
  id: '1',
  title: 'Entendendo as fases do ciclo menstrual',
  description: 'Conheça cada fase do seu ciclo e como elas afetam seu corpo e emoções ao longo do mês.',
  imageAlt: 'Ilustração do ciclo menstrual com as quatro fases representadas em cores',
};

// Requisito: 2.2 — Perfil da usuária exibido no Header
export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Maria',
  notificationCount: 3,
};

// Requisito: 5.2, 5.3 — Itens de acesso rápido na grade 2×2
export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: '1',
    label: 'Sintomas',
    icon: 'medical-outline',
    route: 'Sintomas',
    accessibilityLabel: 'Registrar sintomas',
  },
  {
    id: '2',
    label: 'Ciclo',
    icon: 'sync-outline',
    route: 'Ciclo',
    accessibilityLabel: 'Ir para Ciclo',
  },
  {
    id: '3',
    label: 'Prevenção',
    icon: 'shield-checkmark-outline',
    route: 'Conteudos',
    accessibilityLabel: 'Ir para Conteúdos de Prevenção',
  },
  {
    id: '4',
    label: 'Bem-Estar',
    icon: 'leaf-outline',
    route: 'Conteudos',
    accessibilityLabel: 'Ir para Conteúdos de Bem-Estar',
  },
];

// ─── Artigos de saúde (conteúdo do PDF) ──────────────────────────────────────

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: '1',
    category: 'PREVENÇÃO',
    categoryKey: 'Prevenção',
    title: 'Corrimento Vaginal',
    description: 'Entenda as variações naturais e quando é necessário procurar ajuda médica.',
    icon: 'water-outline',
    content: {
      intro: 'Durante o ciclo da mulher, o muco pode apresentar características diferentes, mas ainda assim ser considerado normal.',
      whatIsNormal: [
        'O muco fisiológico é transparente ou claro, sem odor e não causa coceira.',
        'Durante o período fértil, o muco se torna mais elástico e lubrificante, semelhante a clara de ovo (transparente, escorregadio e fluido), podendo puxá-lo em fio.',
      ],
      whatIsNotNormal: [
        'Coloração branca, aspecto grumoso, acompanhada de coceira intensa e ardor.',
        'Coloração amarelada ou esverdeada, com aspecto bolhoso e odor forte.',
        'Coloração acinzentada, odor fétido e que piora após relação sexual.',
        'Corrimento acompanhado de dor pélvica, dor ou ardência ao urinar e/ou sangramento após a relação sexual.',
      ],
      whenToSeekHelp: [
        'Corrimento com odor forte ou desagradável.',
        'Corrimento amarelado, esverdeado ou acinzentado.',
        'Coceira, ardor, dor durante ou após a relação sexual ou ao urinar.',
        'Gestante com qualquer tipo de alteração (precisa de avaliação mesmo que leve).',
      ],
      whatToDoAtHome: [
        'Mantenha a higiene íntima com água e sabão neutro, sem duchas internas.',
        'Evite roupas muito apertadas e calcinhas com tecidos sintéticos.',
        'Prefira dormir sem calcinha para ventilação da região.',
        'Evite uso de protetores diários contínuos.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para confirmação e tratamento adequado.',
    },
  },
  {
    id: '2',
    category: 'SAÚDE',
    categoryKey: 'Saúde',
    title: 'Cólica Menstrual',
    description: 'Saiba diferenciar desconfortos comuns de sintomas que requerem atenção médica.',
    icon: 'body-outline',
    content: {
      intro: 'É uma dor na parte de baixo da barriga (abaixo do umbigo), comum em mulheres. É muito comum em jovens e adolescentes logo após a primeira menstruação.',
      whenToSeekHelp: [
        'Febre.',
        'Dor muito forte.',
        'Sangramento intenso.',
        'Suspeita ou confirmação de gravidez.',
        'Cólica intensa ou dor intensa à palpação.',
        'Manchas arroxeadas na pele.',
      ],
      whatToDoAtHome: [
        'Fazer compressas de água morna na região inferior do abdômen.',
        'Praticar atividade física.',
        'Manter hidratação e alimentação saudável.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para avaliação e conduta adequada.',
    },
  },
  {
    id: '3',
    category: 'CICLO',
    categoryKey: 'Ciclo',
    title: 'Atraso Menstrual',
    description: 'Saiba quando o atraso requer atenção e o que fazer em casa.',
    icon: 'calendar-outline',
    content: {
      whenToSeekHelp: [
        'Atraso de 15 dias ou mais.',
        'Teste de gravidez positivo.',
      ],
      whatToDoAtHome: [
        'Fazer um teste de gravidez se o atraso for maior que 15 dias.',
        'Anotar seus ciclos para observar um padrão.',
        'Evitar automedicação.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para confirmação e acompanhamento.',
    },
  },
  {
    id: '4',
    category: 'CICLO',
    categoryKey: 'Ciclo',
    title: 'Sangramento Fora do Período',
    description: 'Como observar e registrar sangramentos fora do período menstrual.',
    icon: 'alert-circle-outline',
    content: {
      intro: 'Qualquer sangramento fora do período menstrual deve ser avaliado por um profissional de saúde.',
      whatToDoAtHome: [
        'Observar o volume e frequência do sangramento.',
        'Anotar se há relação com medicamentos ou início de métodos contraceptivos.',
        'Evitar relações sexuais até avaliação se o sangramento for repetido.',
        'Registrar quanto tempo e quais dias você percebeu o sangramento.',
        'Observar se sente mais alguma coisa além do sangramento (ex: cólicas).',
      ],
      warning: 'Procure sempre a UBS para avaliação e exame físico se está com qualquer sangramento fora do período menstrual.',
    },
  },
  {
    id: '5',
    category: 'SAÚDE',
    categoryKey: 'Saúde',
    title: 'Dor ou Ardor ao Urinar',
    description: 'Sintomas associados e quando buscar atendimento médico.',
    icon: 'medical-outline',
    content: {
      intro: 'Preste atenção aos sintomas associados: urgência em urinar, ardor ao urinar, aumento da frequência urinária, dor na região inferior do abdômen ou nas costas, febre.',
      whenToSeekHelp: [
        'Ardor persistente, dor abdominal intensa ou vontade frequente de urinar.',
        'Presença de sangue na urina.',
        'Febre, dor lombar ou calafrios.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para confirmação e tratamento adequado.',
    },
  },
  {
    id: '6',
    category: 'CICLO',
    categoryKey: 'Ciclo',
    title: 'Conheça seu Ciclo Menstrual',
    description: 'Um guia completo sobre as fases do ciclo e como elas afetam seu dia a dia.',
    icon: 'sync-outline',
    content: {
      intro: 'O ciclo menstrual costuma variar entre 21 e 36 dias, com sangramento de 3 a 7 dias. É normal pequenas variações de duração e intensidade, especialmente em adolescentes, pós-parto e perto da menopausa.',
      whatToDoAtHome: [
        'Anotar o ciclo menstrual (dia, duração, intensidade e sintomas).',
        'Fazer compressas mornas para aliviar cólicas.',
        'Manter hidratação e evitar excesso de café e sal durante o período.',
        'Procurar hábitos de relaxamento, como alongamento ou respiração profunda.',
      ],
    },
  },
  {
    id: '7',
    category: 'BEM-ESTAR',
    categoryKey: 'Bem-Estar',
    title: 'TPM e Alterações Emocionais',
    description: 'Entenda as mudanças hormonais e como cuidar do seu bem-estar emocional.',
    icon: 'heart-outline',
    content: {
      intro: 'Antes da menstruação, ocorre uma queda do hormônio estrogênio. Essa mudança pode influenciar substâncias do cérebro, como a serotonina e a dopamina, relacionadas ao bem-estar e às emoções.',
      whatIsNormal: [
        'Algumas mulheres podem sentir irritação, tristeza, sensibilidade maior ou mudanças de humor nesse período.',
        'Nem todas vão sentir os mesmos sintomas, e eles não acontecem apenas por causa da menstruação.',
        'Fatores como estresse, rotina, alimentação, sono e situações pessoais também influenciam bastante.',
      ],
      whatToDoAtHome: [
        'Fazer pequenas refeições equilibradas e praticar exercícios leves.',
        'Reduzir o consumo de álcool e cafeína.',
        'Reservar momentos de descanso e lazer.',
        'Buscar apoio psicológico se sentir sobrecarga emocional.',
      ],
    },
  },
  {
    id: '8',
    category: 'PREVENÇÃO',
    categoryKey: 'Prevenção',
    title: 'Prevenção do Câncer de Colo do Útero',
    description: 'Saiba sobre o Papanicolau e quando realizar o exame preventivo.',
    icon: 'shield-checkmark-outline',
    content: {
      intro: 'Fazer o exame preventivo (Papanicolau) regularmente faz parte do cuidado com a saúde da mulher. Ele ajuda a identificar alterações antes que virem câncer.',
      whatIsNormal: [
        'Se você tem entre 25 e 64 anos, independentemente da orientação sexual, deve procurar a UBS para realizar o exame.',
        'O rastreamento deve ser realizado a partir de 25 anos em todas as mulheres que iniciaram atividade sexual.',
      ],
      whenToSeekHelp: [
        'Se nunca fez o exame preventivo (Papanicolau).',
        'Se está há mais de 1 ano sem realizar o exame.',
        'Se apresenta sangramento fora do período menstrual ou após relação.',
        'Se tem corrimento persistente com cheiro forte ou diferente do habitual.',
        'Se sente dor pélvica frequente sem causa conhecida.',
      ],
      whatToDoAtHome: [
        'Manter os exames preventivos em dia (conforme orientação da UBS).',
        'Usar preservativo nas relações sexuais.',
        'Tomar a vacina contra HPV (quando indicada).',
        'Evitar o tabagismo.',
        'Manter um estilo de vida saudável.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para confirmação e acompanhamento.',
    },
  },
  {
    id: '9',
    category: 'PREVENÇÃO',
    categoryKey: 'Prevenção',
    title: 'Prevenção do Câncer de Mama',
    description: 'Autocuidado e detecção precoce para a saúde das mamas.',
    icon: 'ribbon-outline',
    content: {
      intro: 'Realizar exames de rotina e observar as mamas faz parte do autocuidado e ajuda na detecção precoce.',
      whenToSeekHelp: [
        'Se notar caroço (nódulo) na mama ou na axila.',
        'Se perceber secreção pelo mamilo.',
        'Se houver retração da pele ou do mamilo.',
        'Se perceber pele com aspecto de casca de laranja.',
        'Se observar vermelhidão, inchaço ou mudança no formato da mama.',
        'Se nunca realizou mamografia (a partir dos 40 anos ou antes, se indicado).',
        'Se houver histórico familiar de câncer de mama.',
        'Se sentir dor em uma ou ambas as mamas.',
      ],
      whatToDoAtHome: [
        'Observar suas mamas mensalmente, prestando atenção às mudanças.',
        'Agendar mamografia conforme orientação da UBS.',
        'Evitar tabagismo, excesso de álcool e sedentarismo.',
        'Manter alimentação saudável, rica em frutas, verduras e fibras.',
        'Realizar atividades físicas regularmente.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para confirmação e acompanhamento.',
    },
  },
  {
    id: '10',
    category: 'SAÚDE',
    categoryKey: 'Saúde',
    title: 'Climatério e Menopausa',
    description: 'Entenda essa fase natural da vida e como cuidar do seu bem-estar.',
    icon: 'sunny-outline',
    content: {
      intro: 'O climatério é a fase da vida da mulher em que o corpo está passando da etapa reprodutiva para a não reprodutiva. Essa transição costuma acontecer entre os 40 e 65 anos. A menopausa significa a parada definitiva da menstruação, geralmente entre os 48 e 50 anos.',
      whatIsNormal: [
        'Ondas de calor (fogachos) e suores noturnos.',
        'Alterações do sono, irritabilidade, ansiedade e oscilações de humor.',
        'Irregularidade menstrual (na transição), diminuição da libido.',
        'Ressecamento vaginal, dor na relação sexual, ardor ou coceira vaginal.',
        'Urgência urinária, infecções urinárias recorrentes, ganho de peso.',
      ],
      whenToSeekHelp: [
        'Ao perceber os primeiros sinais e sintomas.',
        'Sintomas intensos que afetam o sono ou a qualidade de vida.',
        'Sangramento após 1 ano sem menstruar.',
        'Dor durante relações sexuais.',
      ],
      whatToDoAtHome: [
        'Dormir em ambiente bem ventilado e usar roupas em camadas.',
        'Não fumar, evitar consumo de bebidas alcoólicas e de cafeína.',
        'Praticar atividade física regularmente.',
        'Manter uma alimentação saudável e hidratação adequada.',
        'Buscar orientação sobre terapia hormonal, se necessário.',
        'Considerar o uso de lubrificantes vaginais durante a relação sexual.',
      ],
      warning: 'Essas informações não substituem avaliação médica. Procure sempre a UBS para confirmação e acompanhamento.',
    },
  },
  {
    id: '11',
    category: 'SAÚDE',
    categoryKey: 'Saúde',
    title: 'Violência Contra a Mulher',
    description: 'Reconheça sinais de abuso e saiba onde buscar ajuda.',
    icon: 'hand-left-outline',
    content: {
      intro: 'A violência contra a mulher é qualquer atitude ou comportamento motivado pelo fato de ela ser mulher que provoque morte, dor, sofrimento ou prejuízo físico, sexual ou emocional. Isso pode acontecer tanto em espaços públicos quanto dentro de casa.',
      whenToSeekHelp: [
        'Se sentir medo, vergonha, culpa ou estiver sendo ameaçada.',
        'Se houver agressões físicas, sexuais ou controle de sua rotina.',
        'Se precisar de apoio para sair de uma relação abusiva.',
      ],
      whatToDoAtHome: [
        'Buscar atendimento na UBS, CRAS, CREAS ou Delegacia da Mulher.',
        'Ligar para o 180 (Central de Atendimento à Mulher) — gratuito e sigiloso.',
        'Pedir ajuda a alguém de confiança e não se isolar.',
      ],
      warning: 'Se estiver em perigo imediato, ligue 190 (Polícia) ou 180 (Central de Atendimento à Mulher).',
    },
  },
  {
    id: '12',
    category: 'BEM-ESTAR',
    categoryKey: 'Bem-Estar',
    title: 'Autocuidado e Hábitos Saudáveis',
    description: 'Dicas práticas para cuidar da sua saúde no dia a dia.',
    icon: 'leaf-outline',
    content: {
      intro: 'Cuidar da saúde é um ato de amor-próprio e deve fazer parte do cotidiano.',
      whatToDoAtHome: [
        'Ter rotina de sono regular e alimentação equilibrada.',
        'Praticar atividade física pelo menos 3x por semana.',
        'Fazer autoexame das mamas para conhecer seu próprio corpo.',
        'Separar momentos de lazer e relaxamento.',
        'Evitar uso abusivo de álcool, cigarro e automedicação.',
      ],
      whenToSeekHelp: [
        'Para acompanhamento regular, vacinação e planejamento familiar.',
        'Para suporte emocional ou sempre que você precisar.',
      ],
    },
  },
];

// Registro de humor por dia (últimos 30 dias — mock)
export interface MoodEntry {
  date: string;   // ISO 8601 YYYY-MM-DD
  moodId: string; // 'otima' | 'bem' | 'neutra' | 'mal' | 'muito_mal'
  emoji: string;
  label: string;
}

export const MOCK_MOOD_HISTORY: MoodEntry[] = [
  { date: '2025-05-15', moodId: 'otima',     emoji: '😄', label: 'Ótima' },
  { date: '2025-05-14', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-05-13', moodId: 'neutra',    emoji: '😐', label: 'Neutra' },
  { date: '2025-05-12', moodId: 'mal',       emoji: '😔', label: 'Mal' },
  { date: '2025-05-11', moodId: 'muito_mal', emoji: '😢', label: 'Muito mal' },
  { date: '2025-05-10', moodId: 'mal',       emoji: '😔', label: 'Mal' },
  { date: '2025-05-09', moodId: 'neutra',    emoji: '😐', label: 'Neutra' },
  { date: '2025-05-08', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-05-07', moodId: 'otima',     emoji: '😄', label: 'Ótima' },
  { date: '2025-05-06', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-05-05', moodId: 'neutra',    emoji: '😐', label: 'Neutra' },
  { date: '2025-05-04', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-05-03', moodId: 'otima',     emoji: '😄', label: 'Ótima' },
  { date: '2025-05-02', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-05-01', moodId: 'mal',       emoji: '😔', label: 'Mal' },
  { date: '2025-04-30', moodId: 'muito_mal', emoji: '😢', label: 'Muito mal' },
  { date: '2025-04-29', moodId: 'mal',       emoji: '😔', label: 'Mal' },
  { date: '2025-04-28', moodId: 'neutra',    emoji: '😐', label: 'Neutra' },
  { date: '2025-04-27', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-04-26', moodId: 'otima',     emoji: '😄', label: 'Ótima' },
  { date: '2025-04-25', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-04-24', moodId: 'neutra',    emoji: '😐', label: 'Neutra' },
  { date: '2025-04-23', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-04-22', moodId: 'otima',     emoji: '😄', label: 'Ótima' },
  { date: '2025-04-21', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-04-20', moodId: 'mal',       emoji: '😔', label: 'Mal' },
  { date: '2025-04-19', moodId: 'neutra',    emoji: '😐', label: 'Neutra' },
  { date: '2025-04-18', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
  { date: '2025-04-17', moodId: 'otima',     emoji: '😄', label: 'Ótima' },
  { date: '2025-04-16', moodId: 'bem',       emoji: '🙂', label: 'Bem' },
];

export const ARTICLE_CATEGORIES = ['Todos', 'Ciclo', 'Prevenção', 'Saúde', 'Bem-Estar'];
