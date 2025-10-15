import Button from "@/components/UI/Button";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "../Text";

interface EmptyStateProps {
  image?: any;
  title: string;
  description: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState = ({
  image,
  title,
  description,
  buttonText,
  onButtonPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      {image && (
        <Image source={image} resizeMode="center" style={styles.image} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonText && onButtonPress && (
        <Button
          title="Adicionar Treino"
          onPress={onButtonPress}
          type="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  image: {
    width: 300,
    height: 300,
    opacity: 0.5,
  },
  title: {
    fontFamily: "TekoRegular",
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontFamily: "RobotoLight",
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
  },
});
