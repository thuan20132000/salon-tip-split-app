import { extend } from 'dayjs';
import React from 'react';
import {
  Text, TouchableOpacity, StyleSheet, GestureResponderEvent, ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator
} from 'react-native';

interface ButtonTextProps extends TouchableOpacityProps {
  title: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle,
  isLoading?: boolean;
}

const ButtonText: React.FC<ButtonTextProps> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.containerStyle]}
      {...props}
      
    >
      <Text style={[styles.text, props.textStyle]}>{props.title}</Text>
      {
        props.isLoading && <ActivityIndicator size="small" color="#FFFFFF" animating={props.isLoading} />
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign:'center'
  },
});

export default ButtonText;