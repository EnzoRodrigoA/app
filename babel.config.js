module.exports = {
  presets: ["babel-preset-expo"], // preset padrão do Expo
  plugins: [
    "react-native-worklets/plugin", // ⚡ precisa estar no final
  ],
};
