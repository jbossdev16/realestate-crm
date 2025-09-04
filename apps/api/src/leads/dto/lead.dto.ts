import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

// Define LeadStatus enum locally until Prisma client is generated
export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  VIEWING_BOOKED = "VIEWING_BOOKED",
  OFFER_MADE = "OFFER_MADE",
  CLOSED = "CLOSED",
  LOST = "LOST",
}

export const CreateLeadDtoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  status: z
    .enum([
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "VIEWING_BOOKED",
      "OFFER_MADE",
      "CLOSED",
      "LOST",
    ])
    .optional()
    .default("NEW"),
  source: z.string().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
});

export const UpdateLeadDtoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z
    .enum([
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "VIEWING_BOOKED",
      "OFFER_MADE",
      "CLOSED",
      "LOST",
    ])
    .optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
});

export class CreateLeadDto {
  @ApiProperty({ description: "Lead email address", required: false })
  email?: string;

  @ApiProperty({ description: "Lead phone number", required: false })
  phone?: string;

  @ApiProperty({ description: "Lead first name" })
  firstName!: string;

  @ApiProperty({ description: "Lead last name" })
  lastName!: string;

  @ApiProperty({
    description: "Lead status",
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status?: LeadStatus = LeadStatus.NEW;

  @ApiProperty({ description: "Lead source", required: false })
  source?: string;

  @ApiProperty({ description: "Lead notes", required: false })
  notes?: string;

  @ApiProperty({ description: "Assigned user ID", required: false })
  assignedTo?: string;
}

export class UpdateLeadDto {
  @ApiProperty({ description: "Lead email address", required: false })
  email?: string;

  @ApiProperty({ description: "Lead phone number", required: false })
  phone?: string;

  @ApiProperty({ description: "Lead first name", required: false })
  firstName?: string;

  @ApiProperty({ description: "Lead last name", required: false })
  lastName?: string;

  @ApiProperty({
    description: "Lead status",
    enum: LeadStatus,
    required: false,
  })
  status?: LeadStatus;

  @ApiProperty({ description: "Lead source", required: false })
  source?: string;

  @ApiProperty({ description: "Lead notes", required: false })
  notes?: string;

  @ApiProperty({ description: "Assigned user ID", required: false })
  assignedTo?: string;
}

export class LeadResponseDto {
  @ApiProperty({ description: "Lead ID" })
  id!: string;

  @ApiProperty({ description: "Lead email address", required: false })
  email?: string;

  @ApiProperty({ description: "Lead phone number", required: false })
  phone?: string;

  @ApiProperty({ description: "Lead first name" })
  firstName!: string;

  @ApiProperty({ description: "Lead last name" })
  lastName!: string;

  @ApiProperty({ description: "Lead status", enum: LeadStatus })
  status!: LeadStatus;

  @ApiProperty({ description: "Lead source", required: false })
  source?: string;

  @ApiProperty({ description: "Lead notes", required: false })
  notes?: string;

  @ApiProperty({ description: "Agency ID" })
  agencyId!: string;

  @ApiProperty({ description: "Assigned user ID", required: false })
  assignedTo?: string;

  @ApiProperty({ description: "Creation date" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date" })
  updatedAt!: Date;
}
