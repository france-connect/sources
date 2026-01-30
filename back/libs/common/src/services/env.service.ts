import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  get(key: string, defaultValue = ''): string {
    return process.env[key] ?? defaultValue;
  }
}
