import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  @ApiResponse({ status: 503, description: "Service is unhealthy" })
  async check() {
    return this.healthService.check();
  }

  @Get("ready")
  @Public()
  @ApiOperation({ summary: "Readiness check endpoint" })
  @ApiResponse({ status: 200, description: "Service is ready" })
  @ApiResponse({ status: 503, description: "Service is not ready" })
  async readiness() {
    return this.healthService.readiness();
  }

  @Get("live")
  @Public()
  @ApiOperation({ summary: "Liveness check endpoint" })
  @ApiResponse({ status: 200, description: "Service is alive" })
  async liveness() {
    return this.healthService.liveness();
  }
}
