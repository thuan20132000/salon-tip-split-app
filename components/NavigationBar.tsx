import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavigationBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  children?: React.ReactNode;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  children,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    // paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    paddingBottom: 10,
  },
  backButton: {
    // padding: 8,
    // marginRight: 8,
    position: 'absolute',
    left: 10,
    bottom: 0,
    padding: 6,
    zIndex: 999
  },
  backButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});

// Usage example
const Screen = () => {
  return (
    <NavigationBar
      title="Screen Title"
      showBackButton={true}
      onBackPress={() => {
        // Custom back action if needed
      }}
    />
  );
};