// Enhanced version with validation and formatting
import React, { useState, useCallback } from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (value: number) => void;
  label?: string;
  errorMessage?: string;
  prefix?: string;
  max?: number;
  min?: number;
}

export const CurrencyInput = ({
  value,
  onChangeText,
  label,
  errorMessage,
  prefix = '$',
  max,
  min = 0,
  style,
  ...props
}: CurrencyInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState<{ start: number, end: number } | null>(null);

  // const formatCurrency = useCallback((num: number): string => {
  //   if (num === 0 && !isFocused) return '';

  //   return new Intl.NumberFormat('en-CA', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(num);
  // }, [isFocused]);

  const parseToNumber = useCallback((text: string): number => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    const numValue = parseInt(cleanedText) || 0;

    // Apply min/max constraints
    if (max !== undefined && numValue > max) return max;
    if (numValue < min) return min;

    return numValue;
  }, [max, min]);

  const handleChangeText = (text: string) => {
    const numericValue = parseToNumber(text);
    onChangeText(numericValue);
  };

  const getInputStyle = () => {
    return [
      styles.input,
      style,
      isFocused && styles.focused,
      errorMessage && styles.error,
    ];
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer,
        errorMessage && styles.errorContainer
      ]}>
        <Text style={styles.prefix}>{prefix}</Text>
        <TextInput
          {...props}
          style={getInputStyle()}
          keyboardType="numeric"
          value={value === 0 ? '' : value.toString()}
          onChangeText={handleChangeText}
          placeholder="0.00"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  focusedContainer: {
    borderColor: '#007AFF',
  },
  errorContainer: {
    borderColor: '#dc3545',
  },
  prefix: {
    paddingLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  input: {
    // flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
    width: 120,
  },
  focused: {
    color: '#007AFF',
  },
  error: {
    color: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
});