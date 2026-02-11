import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Messages sent</Text>
        <Text style={styles.value}>--</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Open conversations</Text>
        <Text style={styles.value}>--</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f2ed' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  label: { color: '#6b7280' },
  value: { fontSize: 18, fontWeight: '600', marginTop: 6 }
})
