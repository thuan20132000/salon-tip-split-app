import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface SubTextProps extends TextProps {
  children: React.ReactNode;
}

const SubText: React.FC<SubTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.subText, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  subText: {
    fontSize: 12,
    color: '#888',
  },
});

export default SubText;