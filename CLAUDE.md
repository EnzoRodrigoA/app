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
