// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { AntDesign } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';

interface FormData {
  username: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { login, isLoading, error, logout } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.username, data.password);
      router.replace('/(app)/(tabs)/(staff)');
    } catch (error) {
      Alert.alert('Error');
    }
  };

  return (
    <KeyboardProvider>
      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#ffffff'
        }}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Controller
            control={control}
            rules={{
              required: 'Username is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <AntDesign name="user" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  placeholderTextColor={'#666'}
                  keyboardType='numeric'
                  returnKeyType='done'
                  returnKeyLabel='Done'
                />
              </View>
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.validationError}>{errors.username.message}</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <AntDesign name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={secureTextEntry}
                  placeholderTextColor={'#666'}
                  keyboardType='numeric'
                  returnKeyType='done'
                  returnKeyLabel='Done'
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <AntDesign
                    name={secureTextEntry ? "eyeo" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.validationError}>{errors.password.message}</Text>
          )}


          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,

  },
  formContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',

  },
  eyeIcon: {
    padding: 10,
  },
  validationError: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  errorContainer: {
    backgroundColor: '#ffe5e5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;