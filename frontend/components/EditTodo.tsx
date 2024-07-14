import React, { useEffect, useState } from "react";
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

type EditTodoModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (
    id: number,
    title: string,
    description: string,
    priority: Priority,
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>; // Add delete function prop
  todo: {
    id: number;
    title: string;
    description: string;
    priority: Priority;
  } | null;
};

const EditTodoModal: React.FC<EditTodoModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete, // Destructure onDelete prop
  todo,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.LOW);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setPriority(todo.priority);
    }
  }, [todo]);

  const handleSave = () => {
    if (todo) {
      onSave(todo.id, title, description, priority);
      resetFields(); // Reset fields after saving
      onClose();
    }
  };

  const handleDelete = async () => {
    if (todo) {
      await onDelete(todo.id);
      onClose();
    }
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setPriority(Priority.LOW);
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
          <Text style={styles.modalTitle}>Edit Todo</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.priorityContainer}>
            <TouchableOpacity
              onPress={() => setPriority(Priority.LOW)}
              style={[
                styles.priorityCircle,
                {
                  backgroundColor:
                    priority === Priority.LOW ? "green" : "lightgray",
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => setPriority(Priority.MEDIUM)}
              style={[
                styles.priorityCircle,
                {
                  backgroundColor:
                    priority === Priority.MEDIUM ? "yellow" : "lightgray",
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => setPriority(Priority.HIGH)}
              style={[
                styles.priorityCircle,
                {
                  backgroundColor:
                    priority === Priority.HIGH ? "red" : "lightgray",
                },
              ]}
            />
          </View>
          <DefaultButton title="Save" onPress={handleSave} />
          <DefaultButton title="Cancel" onPress={onClose} />
          <DefaultButton
            title="Delete"
            onPress={handleDelete}
            backgroundColor="red"
          />
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
    elevation: 5,
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

export default EditTodoModal;
