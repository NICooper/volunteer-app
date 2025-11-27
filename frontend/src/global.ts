import Constants from 'expo-constants';

export const apiUrl = __DEV__ && !process.env.EXPO_PUBLIC_API_URL
  ? `http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000`
  : process.env.EXPO_PUBLIC_API_URL;
