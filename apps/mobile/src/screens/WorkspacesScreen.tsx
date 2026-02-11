import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

export default function WorkspacesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Workspaces'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workspaces</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Bots')}>
        <Text style={styles.cardTitle}>Inboxly Demo</Text>
        <Text style={styles.cardMeta}>3 bots · 12 conversations</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f2ed' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardMeta: { color: '#6b7280', marginTop: 6 }
})
