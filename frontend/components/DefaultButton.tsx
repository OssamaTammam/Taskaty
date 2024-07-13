import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { lightStyles, darkStyles } from "@/styles/ButtonStyles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string; // Optional prop for background color
  textColor?: string; // Optional prop for text color
  borderColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  textColor,
  borderColor,
}) => {
  const { isDarkMode } = useTheme();
  const buttonStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <TouchableOpacity
      style={[
        buttonStyles.button,
        backgroundColor ? { backgroundColor } : null,
        borderColor ? { borderColor, borderWidth: 1 } : null, // Add border color and width
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          buttonStyles.buttonText,
          textColor ? { color: textColor } : null,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
