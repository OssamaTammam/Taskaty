import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Priority } from "@/constants/Priority";
import DefaultButton from "./DefaultButton";

type NewTodoModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (
    type: "Todo" | "Journal",
    title: string,
    description: string,
    priority?: Priority,
  ) => Promise<void>;
};

const NewTodoModal: React.FC<NewTodoModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [type, setType] = useState<"Todo" | "Journal">("Todo");

  const handleSave = () => {
    onSave(type, title, description, priority);
    setTitle("");
    setDescription("");
    setPriority(Priority.LOW);
    setType("Todo"); // Reset to default type
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Entry</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              onPress={() => setType("Todo")}
              style={[
                styles.typeButton,
                { backgroundColor: type === "Todo" ? "#548CA8" : "gray" },
              ]}
            >
              <Text style={styles.typeButtonText}>Todo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType("Journal")}
              style={[
                styles.typeButton,
                { backgroundColor: type === "Journal" ? "#548CA8" : "gray" },
              ]}
            >
              <Text style={styles.typeButtonText}>Journal</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder={type === "Journal" ? "Content" : "Title"}
            value={title}
            onChangeText={setTitle}
          />
          {type === "Todo" && (
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
          )}
          {type === "Todo" && (
            <View style={styles.priorityContainer}>
              <TouchableOpacity
                onPress={() => setPriority(Priority.LOW)}
                style={[
                  styles.priorityCircle,
                  {
                    backgroundColor:
                      priority === Priority.LOW ? "green" : "gray",
                  },
                ]}
              />
              <TouchableOpacity
                onPress={() => setPriority(Priority.MEDIUM)}
                style={[
                  styles.priorityCircle,
                  {
                    backgroundColor:
                      priority === Priority.MEDIUM ? "yellow" : "gray",
                  },
                ]}
              />
              <TouchableOpacity
                onPress={() => setPriority(Priority.HIGH)}
                style={[
                  styles.priorityCircle,
                  {
                    backgroundColor:
                      priority === Priority.HIGH ? "red" : "gray",
                  },
                ]}
              />
            </View>
          )}
          <DefaultButton title="Save" onPress={handleSave} />
          <DefaultButton title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  typeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priorityCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default NewTodoModal;
