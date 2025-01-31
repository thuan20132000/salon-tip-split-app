import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';

interface BadgeProps {
  text?: string;
  color?: string;
  backgroundColor?: string;
  textStyle?: TextStyle,
  containerStyle?: ViewStyle
}

const Badge: React.FC<BadgeProps> = ({ text, color = '#fff', backgroundColor = '#007bff', textStyle, containerStyle }) => {
  return (
    <View style={[styles.badge, { backgroundColor }, containerStyle]}>
      <Text
        style={[styles.text, { color }, textStyle]}
        numberOfLines={1} ellipsizeMode='tail'
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Badge;