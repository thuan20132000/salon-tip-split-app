import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';

interface BadgeProps {
  text?: string;
  color?: string;
  backgroundColor?: string;
  textStyle?: TextStyle
}

const Badge: React.FC<BadgeProps> = ({ text, color = '#fff', backgroundColor = '#007bff', textStyle }) => {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color }, textStyle]}>{text}</Text>
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