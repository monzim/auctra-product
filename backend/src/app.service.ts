import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; timestamp: string; version: string } {
    return {
      message: 'Auctra Backend API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}