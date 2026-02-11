import * as SecureStore from 'expo-secure-store'

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export async function setTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken)
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken)
}

export async function getTokens() {
  const accessToken = await SecureStore.getItemAsync(ACCESS_KEY)
  const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY)
  return { accessToken, refreshToken }
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY)
  await SecureStore.deleteItemAsync(REFRESH_KEY)
}
