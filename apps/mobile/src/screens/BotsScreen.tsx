import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

export default function BotsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Bots'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bots</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Conversations')}>
        <Text style={styles.cardTitle}>Onboarding Bot</Text>
        <Text style={styles.cardMeta}>Published · 2h ago</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.linkText}>View analytics</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f2ed' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardMeta: { color: '#6b7280', marginTop: 6 },
  link: { marginTop: 18 },
  linkText: { color: '#111', textDecorationLine: 'underline' }
})
