import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s, ms } from 'react-native-size-matters';

interface ButtonIconProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  title?: string;
  color?: string;
  size?: number;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  onPress,
  iconName,
  title,
  color = 'black',
  size = ms(12),
  containerStyle,
  titleStyle
}) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyle]} onPress={onPress}>
      <Ionicons name={iconName} size={12} color={color} />
      {
        title && <Text style={[styles.text, { color }, titleStyle]}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    // alignItems: 'center',
    padding: ms(6),
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: s(10),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: ms(2),
    
  },
});

export default ButtonIcon;