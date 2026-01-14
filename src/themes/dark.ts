export const darkTheme = {
  colors: {
    background: {
      primary: "#0A0F1F",
      secondary: "#141B33",
      tertiary: "#1E2747",
      paper: "#1A2238",
      card: "#1E2747",
      overlay: "rgba(10, 15, 31, 0.8)"
    },

    text: {
      primary: "#F0F4FF",
      secondary: "#8B93B8",
      disabled: "#545A7A",
      inverse: "#0A0F1F",
      placeholder: "#6B7280"
    },

    primary: {
      50: "#FFF5E6",
      100: "#FFDBCC",
      200: "#FFB84D",
      300: "#FF9500",
      400: "#FF8800",
      500: "#FF7B00",
      600: "#FF6B00",
      700: "#FF5500",
      800: "#FF4400",
      900: "#FF3300"
    },

    secondary: {
      50: "#FCE4EC",
      100: "#F8BBD0",
      200: "#F48FB1",
      300: "#F06292",
      400: "#EC407A",
      500: "#E91E63",
      600: "#D81B60",
      700: "#C2185B",
      800: "#AD1457",
      900: "#880E4F"
    },

    success: {
      50: "#E8F5E8",
      100: "#C8E6C9",
      500: "#4CAF50",
      600: "#43A047",
      700: "#388E3C"
    },
    warning: {
      50: "#FFF8E1",
      100: "#FFECB3",
      500: "#FFC107",
      600: "#FFB300",
      700: "#FFA000",
      800: "#FF8F00",
      900: "#FF6F00"
    },
    error: {
      50: "#FFEBEE",
      100: "#FFCDD2",
      500: "#F44336",
      600: "#E53935",
      700: "#D32F2F"
    },
    info: {
      50: "#E1F5FE",
      100: "#B3E5FC",
      500: "#03A9F4",
      600: "#039BE5",
      700: "#0288D1"
    },

    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827"
    },

    border: "#2D3748",
    divider: "#374151",
    shadow: "rgba(0, 0, 0, 0.4)",
    backdrop: "rgba(0, 0, 0, 0.5)",

    gradient: {
      primary: ["#FF7B00", "#FF9500"],
      secondary: ["#f093fb", "#f5576c"],
      success: ["#4facfe", "#00f2fe"],
      warning: ["#43e97b", "#38f9d7"]
    },

    chartGradient: {
      start: "#00aeffff",
      end: "transparent"
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    xxxxl: 64
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 20,
    "3xl": 24,
    full: 9999
  },

  typography: {
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: "700" as const,
      fontFamily: "TekoRegular",
      letterSpacing: -0.5
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: "600" as const,
      fontFamily: "TekoRegular",
      letterSpacing: -0.3
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "600" as const,
      fontFamily: "TekoRegular",
      letterSpacing: -0.2
    },
    h4: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "500" as const,
      fontFamily: "TekoRegular"
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
      fontFamily: "RobotoRegular"
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "500" as const,
      fontFamily: "RobotoMedium"
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400" as const,
      fontFamily: "RobotoLight"
    },
    captionMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500" as const,
      fontFamily: "RobotoMedium"
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "400" as const,
      fontFamily: "RobotoLight"
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "600" as const,
      fontFamily: "RobotoMedium",
      textTransform: "uppercase" as const
    }
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 16
    }
  },

  animation: {
    scale: {
      pressed: 0.95,
      hover: 1.05
    },
    timing: {
      fast: 150,
      normal: 300,
      slow: 500
    }
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  }
}
