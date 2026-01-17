# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: LiftLog

**LiftLog** é um app de musculação focado em logging ultrarrápido (<2min/sessão) com gamificação inspirada no Duolingo para alta retenção.

### Visão do Produto

- **Core Value**: Registro de treino em 2 toques, sem fricção
- **Diferencial**: One-Tap Repeat + Ghost Mode + Streaks
- **Target**: Praticantes de musculação que abandonaram outros apps por serem "trabalhosos"

### Features Principais

1. **Quick Log** - Log de série com um toque (repetir último treino)
2. **Streaks** - Sistema de dias consecutivos de treino
3. **Ghost Mode** - Competir contra seu "eu" do treino anterior
4. **Muscle Debt** - Visualização de músculos que precisam de atenção
5. **Insights** - Gráficos de progressão e alertas de platô

## Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios            # Start on iOS simulator
npm run android        # Start on Android emulator
npm run web            # Start web version

# Testing
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode

# Linting
npm run lint           # Run ESLint (expo lint)
```

## Architecture

React Native app built with Expo SDK 54 and expo-router for file-based navigation.

### Path Aliases

Import from `src/` using `@/` prefix (e.g., `import { useWorkout } from "@/hooks/useWorkout"`).

### Provider Hierarchy

The app wraps components in this order (see [_layout.tsx](src/app/_layout.tsx)):
1. `GestureHandlerRootView` - Required for react-native-gesture-handler
2. `ThemeProvider` - Theme context (light/dark, syncs with system)
3. `AuthProvider` - Authentication state management

### Data Layer

**IMPORTANTE**: O app atualmente usa dados mockados em `src/data/mockData.ts`. Não há chamadas reais de API.

- Mock data simula delays realistas (300-800ms)
- Dados persistidos localmente com AsyncStorage
- Preparado para futura integração com backend real

### Navigation Structure

```
src/app/
├── (tabs)/                    # Bottom tab navigator
│   ├── index.tsx              # Home - Treino do dia, streak, ações rápidas
│   ├── progress.tsx           # Progresso - Gráficos e insights
│   └── profile.tsx            # Perfil - Configurações e stats
├── onboarding/                # Fluxo de onboarding (4 telas)
│   ├── index.tsx              # Tela 1: Gancho emocional
│   └── [step].tsx             # Telas 2-4: Setup progressivo
├── workout/
│   ├── [id].tsx               # Execução do treino (log de séries)
│   └── complete/[id].tsx      # Resumo pós-treino
└── sign-in.tsx                # Login/Registro
```

### Key Types

```typescript
// Workout and exercises
interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  sets: ExerciseSet[];
}

interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

// Gamification
interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}
```

### Theming

Theme objects in `src/themes/` contain colors, spacing, borderRadius, typography, shadows, and animation configs. Access via `useTheme()` hook.

**Brand Colors**:
- Primary: `#2196F3` (blue) - Ações principais
- Success: `#4CAF50` (green) - Streak, completed
- Warning: `#FF9800` (orange) - Alertas, PRs

Typography uses custom fonts: Roboto (body text) and Teko (headings/numbers).

### Component Patterns

**One-Tap Repeat**: Componente central do app
```tsx
<SetInput
  previousSet={{ weight: 80, reps: 10 }}
  onQuickRepeat={() => {}}      // Um toque = repetir exato
  onAdjust={(weight, reps) => {}} // Ajuste fino
/>
```

**Streak Display**: Sempre visível na home
```tsx
<StreakBadge
  current={5}
  isToday={true}  // Destaque se treinou hoje
/>
```

### Key Libraries

- **react-native-reanimated** + **react-native-gesture-handler** - Animations and gestures
- **@shopify/react-native-skia** + **d3** - Custom animated charts
- **react-native-draggable-flatlist** - Reorderable lists
- **expo-haptics** - Haptic feedback
- **date-fns** - Date manipulation

### UX Guidelines

1. **Menos é mais**: Cada tela deve ter UMA ação principal óbvia
2. **Feedback imediato**: Haptics + animações em toda interação
3. **Dados do usuário primeiro**: Sempre mostrar último treino como sugestão
4. **Celebrar conquistas**: Animações especiais para PRs e streaks

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utils/Services: `camelCase.ts`
- Types: `PascalCase.ts` (interfaces) ou dentro do componente se local

---

## Design System - Minimalista Clean (Jan 2026)

### Filosofia de Design
O app segue um design **minimalista clean** com foco em:
- ✅ Breathing room generoso (24px horizontal, 32px entre seções)
- ✅ Hierarquia visual clara (títulos → subtítulos → body)
- ✅ Sombras sutis e consistentes
- ✅ Animações suaves (600ms duration, delays escalonados)
- ✅ Componentes modernos com borders arredondadas

### Theme System

**Spacing Scale** (`src/themes/light.ts` e `dark.ts`):
```typescript
spacing: {
  xs: 4,    // Micro gaps
  sm: 8,    // Small gaps
  md: 12,   // Medium gaps
  lg: 16,   // Large gaps
  xl: 24,   // XL gaps (horizontal padding padrão)
  xxl: 32,  // Section spacing padrão
  xxxl: 48, // Large sections
  xxxxl: 64 // Extra large sections
}
```

**Shadow System** (Sutis para minimalismo):
```typescript
shadows: {
  sm: { shadowOpacity: 0.05 },  // Cards suaves
  md: { shadowOpacity: 0.08 },  // Cards elevados
  lg: { shadowOpacity: 0.12 },  // Modals
  xl: { shadowOpacity: 0.15 }   // Overlays
}
```

**Border Radius**:
- Cards pequenos: 16px
- Cards principais: 20-24px
- Buttons/Icons: 12-14px (pequenos), 24px (circulares)

### Component Patterns

#### **Card Component** (`src/components/UI/Card.tsx`)
```tsx
<Card
  variant="elevated" | "outlined" | "filled"
  borderRadius="small" | "medium" | "large"
  padding="none" | "small" | "medium" | "large"
>
  <Card.Header /> {/* Opcional */}
  <Card.Content /> {/* Principal */}
  <Card.Footer />  {/* Opcional */}
</Card>
```

**Uso comum**:
- `elevated`: Cards flutuantes com sombra suave (default para a maioria)
- `outlined`: Borders sutis para secondary content
- `filled`: Background colorido (workout cards, CTAs)

#### **Animation Patterns**

**Entry Animations** (react-native-reanimated):
```tsx
// Padrão de delays escalonados
<Animated.View entering={FadeInDown.duration(600).delay(100)}>
<Animated.View entering={FadeInDown.duration(600).delay(200)}>
<Animated.View entering={FadeInDown.duration(600).delay(300)}>
```

**Interaction Animations**:
```tsx
// Press scale effect
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}));

onPressIn={() => scale.value = withSpring(0.98)}
onPressOut={() => scale.value = withSpring(1)}
```

### Screen Layouts

#### **Home Screen** (`src/app/(tabs)/index.tsx`)
Estrutura vertical com sections espaçadas:
```
1. Header (Avatar + Greeting)          - 32px bottom margin
2. Streak Card (Separado)              - 16px bottom margin
3. Weekly Progress Card (Separado)     - 32px bottom margin
4. Today's Workout Card (Hero)         - 32px bottom margin
   - Badge de status
   - Gradient overlay
   - Meta info com ícones
   - CTA clara
5. InsightPreviewCard (Mini chart)     - 32px bottom margin
6. Progress Stats (2 stats)            - 32px bottom margin
7. Tip Card (Opcional)
```

**Workout Card States**:
- **Active Workout**: Primary blue, gradient overlay, 2 seções (info + CTA)
- **Rest Day**: Secondary bg, border sutil, tips de recuperação
- **Empty**: Dashed border, ícone em container circular, CTA clara

#### **Dashboard Screen** (`src/app/(tabs)/dashboard.tsx`)
```
1. ParallaxScrollView (Header animado)
2. Period Selector (Semana/Mês/Ano)   - Toggle buttons
3. AnimatedText (Valor do período)
4. LineChart (Volume chart animado)
5. Divider visual                      - 32px vertical margin
6. Stats Grid (2x2)                    - Ícones + números + labels
```

**Stats Cards**: 48% width, icons circulares coloridos, border sutil

#### **Profile Screen** (`src/app/(tabs)/user-profile.tsx`)
```
1. ParallaxScrollView (Avatar wave)
2. Personal Info Card                  - Ícones circulares, edit button
3. ExpandableCard "Estatísticas"       - Collapsible stats
4. ExpandableCard "Preferências"       - Settings toggles
5. Logout Card                         - Warning style, outlined
```

**Gap between sections**: 16px

### Custom Components

#### **InsightPreviewCard** (`src/components/InsightPreviewCard.tsx`)
Componente novo para preview de insights semanais:
```tsx
<InsightPreviewCard
  weeklyData={[
    { day: "seg", value: 0.8, label: "S" },
    // ... 7 dias
  ]}
  trend={15}              // % vs semana passada
  totalWorkouts={4}
/>
```

**Features**:
- Mini bar chart animado (80px altura)
- Trend badge (↑ verde ou ↓ vermelho)
- Link para dashboard
- Card elevated com padding 20px

### Animation Guidelines

**Durations**:
- Fast: 150ms (micro-interactions)
- Normal: 300ms (transitions)
- Standard: 600ms (entry animations - **padrão**)
- Slow: 1000ms+ (charts, complex animations)

**Delays** (entry animations):
- 100ms, 200ms, 300ms, 400ms, 500ms, 600ms (escalonados)
- Nunca mais de 6 elementos animados em sequência

**Spring Config**:
```tsx
withSpring(value, {
  damping: 15,   // Suave
  stiffness: 150 // Responsivo
})
```

### Color Usage

**Primary Blue** (`#2196F3`):
- Workout cards ativos
- CTAs principais
- Links e actions
- Progress indicators

**Success Green** (`#4CAF50`):
- Streaks ativos
- Completed states
- Positive trends

**Warning Orange** (`#FF9800`):
- Rest day highlights
- Alerts de platô
- PRs e achievements

**Gray Scale**:
- 50-200: Backgrounds suaves
- 300-500: Borders e dividers
- 600-900: Text secondary to primary

### Spacing Cheat Sheet

**Paddings**:
- Screen horizontal: `24px`
- Card padding: `20px` (small), `24px` (medium)
- Button padding: `12-16px` vertical, `20-24px` horizontal

**Margins**:
- Between sections: `32px`
- Between related items: `16px`
- Between tight items: `8-12px`

**Gaps**:
- Icon + text: `6-8px`
- List items: `12-16px`
- Grid items: `16px`

### Accessibility

- **Touch targets**: Min 44x44px (iOS HIG)
- **Contrast ratio**: Min 4.5:1 (WCAG AA)
- **Font sizes**: Min 14px para body text
- **Haptic feedback**: Sempre em interactions importantes

### Performance Tips

- Use `react-native-reanimated` para animações (roda na UI thread)
- Memoize components pesados com `React.memo`
- Use `useCallback` para event handlers
- Lazy load charts e components pesados
- Otimize imagens (usar expo-image com blurhash)

---

## Changelog

### Jan 2026 - Workout Screen Gamificada (Duolingo-Style)
- ✅ Redesign completo da tela de workout com path map serpentina
- ✅ Novos componentes de gamificação:
  - `ExerciseNode` - Nó com estados (completed, active, upcoming, locked)
  - `PathConnector` - Linhas SVG conectando nós com animação
  - `ExercisePathMap` - Mapa completo com layout serpentina
  - `ActiveExerciseCard` - Card de exercício ativo com sets
- ✅ Home Header simplificado (removido slot machine, treino fixo)
- ✅ WorkoutCard simplificado (apenas CTA de iniciar)
- ✅ Constantes de animação para path (`PATH_ANIMATION`, `NODE_SIZES`)
- ✅ Two-view mode: mapa de overview e card de exercício

### Jan 2026 - Design System Minimalista Clean
- ✅ Refatorado theme spacing system (8 níveis)
- ✅ Reduzido shadow opacity (minimalista)
- ✅ Redesign completo da Home screen
  - Streak banner → 2 cards separados
  - Workout card moderno (gradient, 2 sections, badge)
  - InsightPreviewCard novo componente
  - Progress simplificado (2 stats)
- ✅ Dashboard com period selector
- ✅ Profile com ExpandableCards
- ✅ Animações padronizadas (600ms, delays escalonados)

---

## Workout Execution - Gamified Path Map

### Arquitetura da Tela de Workout

A tela de workout (`src/app/workout/[id].tsx`) usa um sistema de duas visualizações:

1. **Map View**: Mostra o caminho de exercícios em formato serpentina
2. **Exercise View**: Mostra o card do exercício ativo com controles de sets

```
┌────────────────────────────────────┐
│ [←] Peito + Tríceps    3/5 ●●●○○  │  ← Header com progress dots
├────────────────────────────────────┤
│                                    │
│   PATH MAP (viewMode === 'map')    │
│   ┌──────────────────────────┐     │
│   │  ● Ex 1 ✓                │     │  ← Completed (verde)
│   │   ╲                      │     │
│   │    ● Ex 2 ✓              │     │
│   │   ╱                      │     │
│   │  ◉ Ex 3 (ATIVO)          │     │  ← Active (laranja, pulsando)
│   │   ╲                      │     │
│   │    ○ Ex 4                │     │  ← Upcoming (cinza)
│   │   ╱                      │     │
│   │  ○ Ex 5                  │     │  ← Locked (cinza escuro)
│   └──────────────────────────┘     │
│                                    │
│   [ Iniciar Supino Reto → ]        │  ← CTA para exercise view
└────────────────────────────────────┘
```

### Componentes do Path Map

#### `ExerciseNode` (`src/components/workout-execution/ExerciseNode.tsx`)
Nó individual representando um exercício no mapa.

```tsx
type NodeState = "completed" | "active" | "upcoming" | "locked"

interface ExerciseNodeProps {
  exercise: WorkoutExercise
  index: number
  state: NodeState
  position: "left" | "center" | "right"  // Para layout serpentina
  onPress?: () => void
  totalExercises: number
}
```

**Estados visuais**:
- `completed`: Círculo verde com ✓, nome riscado
- `active`: Círculo laranja pulsando, badge "AGORA"
- `upcoming`: Círculo cinza com número
- `locked`: Círculo cinza escuro com 🔒

#### `PathConnector` (`src/components/workout-execution/PathConnector.tsx`)
Linha SVG conectando nós com curvas Bezier.

```tsx
type ConnectorDirection =
  | "left-to-center"
  | "center-to-right"
  | "right-to-center"
  | "center-to-left"

interface PathConnectorProps {
  direction: ConnectorDirection
  isCompleted: boolean
  height?: number
}
```

**Animações**:
- Linha tracejada quando incompleta
- Preenche com gradiente quando completa (600ms)

#### `ExercisePathMap` (`src/components/workout-execution/ExercisePathMap.tsx`)
Mapa completo integrando nós e conectores.

```tsx
interface ExercisePathMapProps {
  exercises: WorkoutExercise[]
  currentIndex: number
  completedIndices: number[]
  onExercisePress?: (index: number) => void
}
```

**Features**:
- Layout serpentina automático (left → center → right → center → ...)
- Auto-scroll para exercício ativo
- Conectores com direção calculada automaticamente

#### `ActiveExerciseCard` (`src/components/workout-execution/ActiveExerciseCard.tsx`)
Card expandido para executar exercício.

```tsx
interface ActiveExerciseCardProps {
  exercise: WorkoutExercise
  sets: ActiveSet[]
  completedSetsCount: number
  exerciseIndex: number
  totalExercises: number
  isLastExercise: boolean
  onSetComplete: (setIndex: number) => void
  onAdjustWeight: (setIndex: number, delta: number) => void
  onAdjustReps: (setIndex: number, delta: number) => void
  onNextExercise: () => void
}
```

### Constantes de Animação

```tsx
// src/utils/constants.ts

export const PATH_ANIMATION = {
  nodeEntryDelay: 80,      // Delay entre nós na entrada
  nodeEntryDuration: 400,  // Duração da animação de entrada
  pulseDuration: 800,      // Duração do pulse do nó ativo
  pulseScale: 1.1,         // Escala máxima do pulse
  pathFillDuration: 600,   // Duração do preenchimento da linha
  completionDelay: 200,    // Delay antes da animação de conclusão
  completionDuration: 500, // Duração da animação de conclusão
}

export const NODE_SIZES = {
  default: 64,
  active: 72,
  completed: 64,
}
```

### Fluxo de Navegação

1. Home → Toca "Iniciar Treino"
2. Workout Map View → Vê visão geral do treino
3. Toca "Iniciar [Exercício]" → Exercise View
4. Completa sets → Volta para Map View (com nó marcado)
5. Repete até último exercício
6. Finaliza → Volta para Home
