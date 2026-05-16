export type RootStackParamList = {
  // Auth flow
  Login: undefined;
  Register: undefined;
  // Main app
  Main: undefined;
  QuickRegisterModal: undefined;
  ArticleDetail: { articleId: string };
  Notifications: undefined;
  DayDetail: undefined;
  Sintomas: undefined;
};

export type TabParamList = {
  Hoje: undefined;
  Ciclo: undefined;
  Conteudos: undefined;
  Perfil: undefined;
};
