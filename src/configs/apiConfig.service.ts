import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}
  get firebaseConfig() {
    return {
      projectId: this.get('FIREBASE_PROJECT_ID'),
      privateKey: this.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      clientEmail: this.get('FIREBASE_CLIENT_EMAIL'),
    };
  }

  public get(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(key + ' environment variable does not set');
    }
    return value;
  }
}
