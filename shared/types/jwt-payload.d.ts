
export type JwtPayload = {
  sub: number;
  rol: 'org' | 'user';
  iat: number;
  exp: number;
}
