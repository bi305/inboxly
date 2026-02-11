import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import AuthScreen from './src/screens/AuthScreen'
import WorkspacesScreen from './src/screens/WorkspacesScreen'
import BotsScreen from './src/screens/BotsScreen'
import ConversationsScreen from './src/screens/ConversationsScreen'
import ConversationDetailScreen from './src/screens/ConversationDetailScreen'
import AnalyticsScreen from './src/screens/AnalyticsScreen'

export type RootStackParamList = {
  Auth: undefined
  Workspaces: undefined
  Bots: undefined
  Conversations: undefined
  ConversationDetail: { id: string }
  Analytics: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Workspaces" component={WorkspacesScreen} />
        <Stack.Screen name="Bots" component={BotsScreen} />
        <Stack.Screen name="Conversations" component={ConversationsScreen} />
        <Stack.Screen name="ConversationDetail" component={ConversationDetailScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
