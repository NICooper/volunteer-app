import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

const ACCESS_JWT_KEY = 'accessToken';

export async function getAccessJwt() {
  return getItemAsync(ACCESS_JWT_KEY);
}

export async function storeAccessJwt(jwt: string) {
  setItemAsync(ACCESS_JWT_KEY, jwt);
}

export async function clearAccessJwt() {
  deleteItemAsync(ACCESS_JWT_KEY);
}

export async function parseJwtPayload<T>(jwt: string): Promise<T> {
  const payloadBase64 = jwt.split('.')[1];
  const payloadJson = atob(payloadBase64);
  return JSON.parse(payloadJson) as T;
}
