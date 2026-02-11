import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { setTokens } from '../lib/auth'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

export default function AuthScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Auth'>) {
  const handleLogin = async () => {
    await setTokens('demo-access', 'demo-refresh')
    navigation.replace('Workspaces')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f5f2ed' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#111', padding: 14, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
})
