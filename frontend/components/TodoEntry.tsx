// TodoEntry.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Priority } from "@/constants/Priority";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/constants/Api";

type TodoEntryProps = {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  dayId: number;
  onEdit: (todo: {
    id: number;
    title: string;
    description?: string;
    priority: Priority;
  }) => void; // Add onEdit prop
};

const TodoEntry: React.FC<TodoEntryProps> = ({
  id,
  title,
  description,
  priority,
  completed,
  completedAt,
  createdAt,
  updatedAt,
  dayId,
  onEdit,
}) => {
  const { jwt } = useAuth();
  const [isCompleted, setIsCompleted] = useState(completed);

  const getPriorityColor = (priority: Priority) => {
    switch (priority as string) {
      case "LOW":
        return "green";
      case "MEDIUM":
        return "yellow";
      case "HIGH":
        return "red";
      default:
        return "gray";
    }
  };

  const handleToggleCompleted = async () => {
    const newCompletedStatus = !isCompleted;
    setIsCompleted(newCompletedStatus);

    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt}`,
        },
        body: JSON.stringify({ id, completed: newCompletedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo completion status.");
      }
    } catch (error) {
      console.error("Error updating todo completion status:", error);
      setIsCompleted(completed);
    }
  };

  const handleEdit = () => {
    onEdit({ id, title, description, priority }); // Call onEdit with todo details
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggleCompleted} style={styles.checkbox}>
        <MaterialIcons
          name={isCompleted ? "check-box" : "check-box-outline-blank"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <Text style={styles.dateText}>
          Created At: {createdAt.toLocaleString()}
        </Text>
        {isCompleted && completedAt && (
          <Text style={styles.dateText}>
            Completed At: {completedAt.toLocaleString()}
          </Text>
        )}
      </View>
      <View style={styles.priorityContainer}>
        <View
          style={[
            styles.priorityCircle,
            { backgroundColor: getPriorityColor(priority) },
          ]}
        />
      </View>
      <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
        <MaterialIcons name="edit" size={24} color="#9BA1A6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "space-between",
  },
  checkbox: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  priorityContainer: {
    marginLeft: 10,
  },
  priorityCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  editButton: {
    marginLeft: 10,
  },
});

export default TodoEntry;
