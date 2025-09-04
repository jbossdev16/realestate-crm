import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class LoginDto {
  @ApiProperty({ description: "User email address" })
  email!: string;

  @ApiProperty({ description: "User password", minLength: 6 })
  password!: string;
}

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  agencyId: z.string().optional(),
});

export class RegisterDto {
  @ApiProperty({ description: "User email address" })
  email!: string;

  @ApiProperty({ description: "User password", minLength: 6 })
  password!: string;

  @ApiProperty({ description: "User first name" })
  firstName!: string;

  @ApiProperty({ description: "User last name" })
  lastName!: string;

  @ApiProperty({ description: "Agency ID", required: false })
  agencyId?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: "JWT access token" })
  accessToken!: string;

  @ApiProperty({ description: "JWT refresh token" })
  refreshToken!: string;

  @ApiProperty({ description: "User information" })
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    agencyId: string;
  };
}

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string(),
});

export class RefreshTokenDto {
  @ApiProperty({ description: "Refresh token" })
  refreshToken!: string;
}
