import React from "react";
import { View, Text, StyleSheet } from "react-native";

type JournalEntryProps = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  dayId: number;
};

const JournalEntry: React.FC<JournalEntryProps> = ({
  id,
  content,
  createdAt,
  updatedAt,
  dayId,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  content: {
    fontSize: 16,
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
});

export default JournalEntry;
