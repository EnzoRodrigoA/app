import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import Slider from "@react-native-community/slider"
import * as Hapitcs from "expo-haptics"
import { memo, useState } from "react"
import { StyleSheet, View } from "react-native"

const moods = [
  { id: 1, emoji: "😮‍💨", label: "Fraco" },
  { id: 2, emoji: "😐", label: "Neutro" },
  { id: 3, emoji: "🙂", label: "Tranquilo" },
  { id: 4, emoji: "💪", label: "Forte" },
  { id: 5, emoji: "🔥", label: "Insano" }
]

interface MoodSliderProps {
  scaleWidth: number
}
export const MoodSlider = memo(function MoodSlider({ scaleWidth }: MoodSliderProps) {
  const [value, setValue] = useState(3)
  const theme = useTheme()

  const currentMood = moods.find((m) => m.id === value)

  const normalizeSize = (size: number) => Math.round(size * scaleWidth)

  const handleValueChange = (newValue: number) => {
    if (newValue !== value) {
      setValue(newValue)
      Hapitcs.selectionAsync()
    }
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: normalizeSize(10)
    },
    highlightFeedback: {
      alignItems: "center",
      marginBottom: normalizeSize(10)
    },
    highlightEmoji: {
      fontSize: normalizeSize(36)
    },
    highlightText: {
      fontWeight: "bold",
      marginTop: normalizeSize(1)
    },
    slider: {
      width: "100%",
      height: normalizeSize(40),
      marginBottom: normalizeSize(5)
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: normalizeSize(5)
    },
    markerEmoji: {
      fontSize: normalizeSize(24)
    },
    moodLabel: {
      fontSize: normalizeSize(12),
      fontWeight: "bold",
      color: theme.theme.colors.text.secondary
    }
  })

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.highlightFeedback}>
        <Text style={dynamicStyles.highlightEmoji}>{currentMood?.emoji}</Text>
        <Text style={[dynamicStyles.highlightText, { color: theme.theme.colors.text.disabled }]}>
          {currentMood?.label}
        </Text>
      </View>

      <Slider
        style={dynamicStyles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        minimumTrackTintColor={theme.theme.colors.primary[500]}
        maximumTrackTintColor={theme.theme.colors.primary[600]}
        thumbTintColor={theme.theme.colors.primary[500]}
        value={value}
        onValueChange={handleValueChange}
      />

      <View style={dynamicStyles.iconRow}>
        {moods.map((mood) => (
          <View key={mood.id}>
            <Text style={[dynamicStyles.markerEmoji, { opacity: mood.id === value ? 1 : 0.5 }]}>
              {mood.emoji}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
})
