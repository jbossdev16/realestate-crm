import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { LeadsModule } from "./leads/leads.module";
import { UsersModule } from "./users/users.module";
import { AgenciesModule } from "./agencies/agencies.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    HealthModule,
    AuthModule,
    LeadsModule,
    UsersModule,
    AgenciesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
