import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

export default function ConversationDetailScreen({ route }: NativeStackScreenProps<RootStackParamList, 'ConversationDetail'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversation {route.params.id}</Text>
      <View style={styles.bubbleBot}>
        <Text>Hi! How can I help?</Text>
      </View>
      <View style={styles.bubbleUser}>
        <Text style={{ color: '#fff' }}>Need pricing</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f2ed' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  bubbleBot: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8 },
  bubbleUser: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 12,
    marginLeft: 'auto'
  }
})
