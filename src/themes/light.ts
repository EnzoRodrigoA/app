export const lightTheme = {
  colors: {
    background: {
      primary: "#FFFFFF",
      secondary: "#F8F9FA",
      tertiary: "#E9ECEF",
      paper: "#FFFFFF",
      card: "#F8F9FA",
      overlay: "rgba(255, 255, 255, 0.8)"
    },

    text: {
      primary: "#212529",
      secondary: "#6C757D",
      disabled: "#ADB5BD",
      inverse: "#FFFFFF",
      placeholder: "#6C757D"
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
      50: "#FFF3E0",
      100: "#FFE0B2",
      200: "#FFCC80",
      300: "#FFB74D",
      400: "#FFA726",
      500: "#FF9800",
      600: "#FB8C00",
      700: "#F57C00",
      800: "#EF6C00",
      900: "#E65100"
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
      500: "#2196F3",
      600: "#1E88E5",
      700: "#1976D2"
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

    border: "#E5E7EB",
    divider: "#D1D5DB",
    shadow: "rgba(0, 0, 0, 0.1)",
    backdrop: "rgba(0, 0, 0, 0.3)",

    gradient: {
      primary: ["#FF7B00", "#FF9500"],
      secondary: ["#43e97b", "#38f9d7"],
      success: ["#4facfe", "#00f2fe"],
      warning: ["#fa709a", "#fee140"]
    },

    chartGradient: {
      start: "#7ad5ff2d",
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
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 16
    }
  },

  animation: {
    scale: {
      pressed: 0.98,
      hover: 1.02
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
