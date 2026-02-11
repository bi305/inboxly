import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

export default function ConversationsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Conversations'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversations</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ConversationDetail', { id: '1' })}
      >
        <Text style={styles.cardTitle}>+1 (555) 201-8899</Text>
        <Text style={styles.cardMeta}>Need help with booking</Text>
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
