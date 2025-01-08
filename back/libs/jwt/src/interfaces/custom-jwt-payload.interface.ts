import { JWTPayload } from 'jose';

export type CustomJwtPayload<T> = T & JWTPayload;
