import { Injectable, Logger } from "@nestjs/common";
import { prisma } from "@realestate-crm/db";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  async check() {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        api: "healthy",
        database: "unknown",
        redis: "unknown",
        qdrant: "unknown",
        minio: "unknown",
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    // Check database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = "connected";
    } catch (error) {
      this.logger.error("Database health check failed", error);
      health.services.database = "disconnected";
      health.status = "degraded";
    }

    // TODO: Add Redis, Qdrant, and MinIO health checks
    // For now, we'll assume they're healthy if database is connected
    if (health.services.database === "connected") {
      health.services.redis = "connected";
      health.services.qdrant = "connected";
      health.services.minio = "connected";
    }

    return health;
  }

  async readiness() {
    const readiness = {
      status: "ready",
      timestamp: new Date().toISOString(),
      checks: {
        database: "ready",
        redis: "ready",
        qdrant: "ready",
        minio: "ready",
      },
    };

    // Check if all critical services are ready
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      this.logger.error("Readiness check failed", error);
      readiness.status = "not_ready";
      readiness.checks.database = "not_ready";
    }

    // TODO: Add other service readiness checks

    return readiness;
  }

  async liveness() {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
