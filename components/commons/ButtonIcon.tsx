import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonIconProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  title?: string;
  color?: string;
  size?: number;
  containerStyle?: ViewStyle;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  onPress,
  iconName,
  title,
  color = 'black',
  size = 24,
  containerStyle
}) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyle]} onPress={onPress}>
      <Ionicons name={iconName} size={size} color={color} />
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ButtonIcon;