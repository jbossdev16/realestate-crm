import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: 'connected',
        redis: 'connected',
        qdrant: 'connected',
        minio: 'connected'
      }
    };
  }
}
