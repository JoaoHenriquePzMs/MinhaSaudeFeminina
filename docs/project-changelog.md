---

## [v1.1.0] — 2026-08-25

### Adicionado
- **Sistema de registro de ciclo menstrual** com persistência local (AsyncStorage)
- Botões "Iniciar Menstruação" e "Finalizar Menstruação" na tela de Ciclo
- **Seletor de data (DatePicker)** para escolher a data de início/término (não fixo em "hoje")
- **Calendário visual** com marcações circulares em cores amigáveis:
  - Rosa suave (`#F4A6B8`) para períodos registrados
  - Rosa claro (`#FADCE3`) para previsões
  - Anel rosa (`#E88FA5`) para o dia atual
- **Card de previsão** do próximo ciclo com contagem regressiva
- **Tela de Histórico** para consulta de todos os registros com estatísticas
- Cálculo automático de duração média do ciclo e da menstruação
- Serviço de persistência `cycleStorage.ts` com CRUD completo

### Modificado
- Hook `useCycleData` reescrito para usar dados reais do AsyncStorage
- `HomeScreen` ajustada para compatibilidade com novo hook
- Navegação atualizada com rota `History`

### Dependências
- `@react-native-async-storage/async-storage` (persistência local)
- `@react-native-community/datetimepicker` (seletor de data)

---