import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // Note: Validation is now handled by Zod schemas in individual controllers
  // No global ValidationPipe needed since we're using Zod for validation

  // Global throttler guard
  // Note: ThrottlerGuard is automatically applied via the module configuration

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix("api/v1");

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Real Estate CRM API")
    .setDescription("API for Real Estate CRM with AI capabilities")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Authentication endpoints")
    .addTag("leads", "Lead management")
    .addTag("users", "User management")
    .addTag("agencies", "Agency management")
    .addTag("health", "Health check endpoints")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📚 API docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
