import { useTheme } from "@/contexts/ThemeContext"
import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated"
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path)

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

const CONNECTOR_HEIGHT = 50

/**
 * SVG path connector for the exercise path map
 * Creates curved bezier lines connecting exercise nodes
 */
export const PathConnector = ({
  direction,
  isCompleted,
  height = CONNECTOR_HEIGHT
}: PathConnectorProps) => {
  const { theme } = useTheme()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (isCompleted) {
      progress.value = withTiming(1, { duration: 600 })
    } else {
      progress.value = 0
    }
  }, [isCompleted, progress])

  // Calculate path based on direction - improved curves
  const getPath = () => {
    const width = 280
    const centerX = width / 2
    const leftX = 76 // Aligned with left node center
    const rightX = width - 76 // Aligned with right node center

    switch (direction) {
      case "left-to-center":
        // Smooth S-curve from left to center
        return `M ${leftX} 0 C ${leftX} ${height * 0.5}, ${centerX} ${
          height * 0.5
        }, ${centerX} ${height}`
      case "center-to-right":
        // Smooth S-curve from center to right
        return `M ${centerX} 0 C ${centerX} ${height * 0.5}, ${rightX} ${
          height * 0.5
        }, ${rightX} ${height}`
      case "right-to-center":
        // Smooth S-curve from right to center
        return `M ${rightX} 0 C ${rightX} ${height * 0.5}, ${centerX} ${
          height * 0.5
        }, ${centerX} ${height}`
      case "center-to-left":
        // Smooth S-curve from center to left
        return `M ${centerX} 0 C ${centerX} ${height * 0.5}, ${leftX} ${
          height * 0.5
        }, ${leftX} ${height}`
      default:
        return `M ${centerX} 0 L ${centerX} ${height}`
    }
  }

  const pathLength = 150 // Approximate path length

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value)
  }))

  const completedColor = theme.colors.success[500]
  const incompleteColor = theme.colors.gray[300]

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={280} height={height} style={styles.svg}>
        <Defs>
          <LinearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={completedColor} stopOpacity="1" />
            <Stop offset="1" stopColor={completedColor} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>

        {/* Background path (incomplete) */}
        <Path
          d={getPath()}
          stroke={incompleteColor}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="8 8"
          fill="none"
        />

        {/* Foreground path (completed - animated) */}
        {isCompleted && (
          <AnimatedPath
            d={getPath()}
            stroke="url(#pathGradient)"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={pathLength}
            animatedProps={animatedProps}
          />
        )}
      </Svg>
    </View>
  )
}

/**
 * Simple vertical connector for straight paths
 */
interface VerticalConnectorProps {
  isCompleted: boolean
  height?: number
}

export const VerticalConnector = ({ isCompleted, height = 40 }: VerticalConnectorProps) => {
  const { theme } = useTheme()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (isCompleted) {
      progress.value = withTiming(1, { duration: 400 })
    } else {
      progress.value = 0
    }
  }, [isCompleted, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    height: height * progress.value
  }))

  return (
    <View style={[styles.verticalContainer, { height }]}>
      {/* Background line */}
      <View
        style={[
          styles.verticalLine,
          {
            backgroundColor: theme.colors.gray[300],
            height
          }
        ]}
      />
      {/* Completed line overlay */}
      {isCompleted && (
        <Animated.View
          style={[
            styles.verticalLineCompleted,
            {
              backgroundColor: theme.colors.success[500]
            },
            animatedStyle
          ]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    alignSelf: "center",
    overflow: "hidden"
  },
  svg: {
    alignSelf: "center"
  },
  verticalContainer: {
    width: 4,
    alignSelf: "center",
    position: "relative"
  },
  verticalLine: {
    width: 4,
    borderRadius: 2
  },
  verticalLineCompleted: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    borderRadius: 2
  }
})
