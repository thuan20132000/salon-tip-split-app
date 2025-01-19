import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ms, scale } from 'react-native-size-matters';

interface TipBadgeProps {
  amount: number;
  containerStyle?: ViewStyle
}

const TipBadge: React.FC<TipBadgeProps> = ({ amount,containerStyle }) => {
  return (
    <View style={[styles.badge, containerStyle]}>
      <Text style={styles.text}>Tip: ${amount.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFD700',
    padding: ms(5),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontSize: ms(10),
    fontWeight: 'bold',
  },
});

export default TipBadge;