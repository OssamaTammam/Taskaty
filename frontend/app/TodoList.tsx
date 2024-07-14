import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, FlatList } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import TodoHeader from "@/components/TodoHeader";
import TodoEntry from "@/components/TodoEntry";
import NewTodoModal from "@/components/NewTodo";
import EditTodoModal from "@/components/EditTodo"; // Import the EditTodoModal
import { Priority } from "@/constants/Priority";
import { API_URL } from "@/constants/Api";
import DefaultButton from "@/components/DefaultButton";
import JournalEntry from "@/components/JournalEntry";

const TodoList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [day, setDay] = useState<{ todos: any[]; journals: any[] } | null>(
    null,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [selectedTodo, setSelectedTodo] = useState(null); // State for selected todo
  const { jwt } = useAuth();

  /**
   * Fetches the day data from the API based on the current date selected.
   */
  const fetchDay = async () => {
    try {
      const response = await fetch(`${API_URL}/day`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt}`,
        },
        body: JSON.stringify({ date: currentDate.toISOString() }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setDay(responseData.data);
      } else {
        Alert.alert("Error", "Failed fetching day.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  /**
   * Fetches current day
   */
  useEffect(() => {
    fetchDay();
  }, [currentDate, jwt]);

  const handleSaveNewEntry = async (
    type: "Todo" | "Journal",
    title: string,
    description: string,
    priority?: Priority,
  ) => {
    const priorityString =
      priority === Priority.LOW
        ? "low"
        : priority === Priority.MEDIUM
        ? "medium"
        : "high";

    const formattedDate: string = currentDate.toISOString().split("T")[0];

    const entryData =
      type === "Todo"
        ? { title, description, priority: priorityString, date: formattedDate }
        : { content: title, date: formattedDate };
    try {
      const response = await fetch(`${API_URL}/${type.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt}`,
        },
        body: JSON.stringify(entryData),
      });

      if (response.ok) {
        await fetchDay(); // Fetch the updated day data after saving
      } else {
        Alert.alert("Error", `Failed saving ${type.toLowerCase()}.`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleEditTodo = (todo: any) => {
    setSelectedTodo(todo); // Set the selected todo
    setEditModalVisible(true); // Open the edit modal
  };

  const handleSaveEditedTodo = async (
    id: number,
    title: string,
    description: string,
    priority: Priority,
  ) => {
    const priorityString =
      priority === Priority.LOW
        ? "low"
        : priority === Priority.MEDIUM
        ? "medium"
        : "high";

    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt}`,
        },
        body: JSON.stringify({
          id,
          title,
          description,
          priority: priorityString,
        }),
      });

      if (response.ok) {
        await fetchDay(); // Fetch updated data
        setEditModalVisible(false); // Close the edit modal
        setSelectedTodo(null); // Clear the selected todo
      } else {
        Alert.alert("Error", "Failed to update todo.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt}`,
        },
        body: JSON.stringify({ id }), // Assuming your API expects the ID in the request body
      });

      if (response.ok) {
        await fetchDay(); // Refresh the list after deletion
      } else {
        Alert.alert("Error", "Failed to delete todo.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <TodoHeader date={currentDate} setDate={setCurrentDate} />
          <DefaultButton
            title="Add New Entry"
            onPress={() => setModalVisible(true)}
          />
          <NewTodoModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveNewEntry}
          />
          <EditTodoModal
            visible={isEditModalVisible}
            onClose={() => setEditModalVisible(false)}
            onSave={handleSaveEditedTodo}
            todo={selectedTodo}
            onDelete={handleDeleteTodo}
          />
          {day && (
            <FlatList
              data={[
                ...day.todos,
                ...day.journals.map((journal) => ({
                  ...journal,
                  isJournal: true,
                })),
              ]}
              keyExtractor={(item) =>
                item.isJournal ? `journal-${item.id}` : `todo-${item.id}`
              }
              renderItem={({ item }) =>
                item.isJournal ? (
                  <JournalEntry
                    id={item.id}
                    content={item.content}
                    createdAt={new Date(item.createdAt)}
                    updatedAt={new Date(item.updatedAt)}
                    dayId={item.dayId}
                  />
                ) : (
                  <TodoEntry
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    priority={item.priority}
                    completed={item.completed}
                    completedAt={
                      item.completedAt ? new Date(item.completedAt) : null
                    }
                    createdAt={new Date(item.createdAt)}
                    updatedAt={new Date(item.updatedAt)}
                    dayId={item.dayId}
                    onEdit={handleEditTodo} // Pass the edit function
                  />
                )
              }
            />
          )}
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default TodoList;
