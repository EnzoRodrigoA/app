import { useTheme } from "@ui-kitten/components";
import { ReactNode } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AppModal({
  visible,
  onClose,
  children,
}: AppModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.centered}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme["background-basic-color-1"] },
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.654)",
  },
  centered: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
    elevation: 5,
  },
});
