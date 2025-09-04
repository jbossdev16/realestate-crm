import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

// Define UserRole enum locally until Prisma client is generated
export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  VIEWER = "VIEWER",
}

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  role: z
    .enum(["OWNER", "ADMIN", "AGENT", "VIEWER"])
    .optional()
    .default("AGENT"),
  agencyId: z.string().uuid(),
});

export const UpdateUserDtoSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["OWNER", "ADMIN", "AGENT", "VIEWER"]).optional(),
});

export const ChangePasswordDtoSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export class CreateUserDto {
  @ApiProperty({ description: "User email address" })
  email!: string;

  @ApiProperty({ description: "User password", minLength: 6 })
  password!: string;

  @ApiProperty({ description: "User first name" })
  firstName!: string;

  @ApiProperty({ description: "User last name" })
  lastName!: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role?: UserRole = UserRole.AGENT;

  @ApiProperty({ description: "Agency ID" })
  agencyId!: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: "User email address", required: false })
  email?: string;

  @ApiProperty({ description: "User password", required: false, minLength: 6 })
  password?: string;

  @ApiProperty({ description: "User first name", required: false })
  firstName?: string;

  @ApiProperty({ description: "User last name", required: false })
  lastName?: string;

  @ApiProperty({ description: "User role", enum: UserRole, required: false })
  role?: UserRole;
}

export class UserResponseDto {
  @ApiProperty({ description: "User ID" })
  id!: string;

  @ApiProperty({ description: "User email address" })
  email!: string;

  @ApiProperty({ description: "User first name" })
  firstName!: string;

  @ApiProperty({ description: "User last name" })
  lastName!: string;

  @ApiProperty({ description: "User role", enum: UserRole })
  role!: UserRole;

  @ApiProperty({ description: "Agency ID" })
  agencyId!: string;

  @ApiProperty({ description: "Creation date" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date" })
  updatedAt!: Date;
}

export class ChangePasswordDto {
  @ApiProperty({ description: "Current password" })
  currentPassword!: string;

  @ApiProperty({ description: "New password", minLength: 6 })
  newPassword!: string;
}
