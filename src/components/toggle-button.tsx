import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import { colors } from "../styles/colors";
import ThemeProvider from "./theme-provider";
import { AppTheme } from '../themes';

interface Props {
  label: string;
  checked: boolean;
  disabled: boolean;
  style: object;
  onPress: () => void;
}

const ToggleButton = ({ label, checked, disabled, style, onPress }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = btnStyles(theme);

  const WrapperComponent = disabled ? View : TouchableOpacity;

  return (
    <WrapperComponent
      style={[
        styles.btn,
        checked ? styles.btnActive : styles.btnInactive,
        style,
      ]}
      onPress={disabled ? undefined : onPress} // Only add onPress to TouchableOpacity
    >
      <Text
        style={checked === true ? styles.textActive : styles.textInactive}
      >
        {label}
      </Text>
    </WrapperComponent>
  );
}

const btnStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    textActive: {
      color: colors.primary.contractText,
      fontSize: 12,
      textAlign: "center",
    },
    textInactive: {
      color: theme.colors.text.constrast,
      fontSize: 12,
      textAlign: "center",
    },
    btn: {
      borderRadius: 2,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    btnActive: {
      borderColor: colors.primary.dark,
      backgroundColor: theme.colors.mark,
    },
    btnInactive: {
      borderColor: colors.text.disabled,
    },
  });
};

export default ToggleButton;
