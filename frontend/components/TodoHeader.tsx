import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const TodoHeader = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: (newDate: Date) => Date) => void;
}) => {
  const getCurrentDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day}.${month}.${year}`;
  };

  const changeDate = (days: number) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + days);
      return newDate;
    });
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => changeDate(-1)} style={styles.button}>
        <Text style={styles.buttonText}>&lt;</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{getCurrentDate(date)}</Text>
      <TouchableOpacity onPress={() => changeDate(1)} style={styles.button}>
        <Text style={styles.buttonText}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8", // Background color
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 24, // Increased font size for button text
    color: "#548CA8", // Button text color
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#548CA8",
  },
});

export default TodoHeader;
