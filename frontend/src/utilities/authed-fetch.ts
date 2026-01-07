import { useContext } from 'react';
import { clearAccessJwt, getAccessJwt } from './jwt';
import { UserContext } from '../app/_layout';

export async function authedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = await getAccessJwt();

  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, { ...init, headers: headers });

  if (response.status === 401) {
    clearAccessJwt();
    const { setUser } = useContext(UserContext);
    setUser(undefined);
  }

  return response;
}
