import { StyleSheet, ViewStyle, TextStyle } from "react-native";

const commonStyles: {
  button: ViewStyle;
  buttonText: TextStyle;
} = {
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 3,
    marginHorizontal: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
};

const lightStyles = StyleSheet.create({
  button: {
    ...commonStyles.button,
    backgroundColor: "#0a7ea4",
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: "#fff",
  },
});

const darkStyles = StyleSheet.create({
  button: {
    ...commonStyles.button,
    backgroundColor: "##fff",
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: "#0a7ea4",
  },
});

export { lightStyles, darkStyles };
