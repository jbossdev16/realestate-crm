import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const CreateAgencyDtoSchema = z.object({
  name: z.string(),
  domain: z.string().optional(),
});

export const UpdateAgencyDtoSchema = z.object({
  name: z.string().optional(),
  domain: z.string().optional(),
});

export class CreateAgencyDto {
  @ApiProperty({ description: "Agency name" })
  name!: string;

  @ApiProperty({ description: "Agency domain", required: false })
  domain?: string;
}

export class UpdateAgencyDto {
  @ApiProperty({ description: "Agency name", required: false })
  name?: string;

  @ApiProperty({ description: "Agency domain", required: false })
  domain?: string;
}

export class AgencyResponseDto {
  @ApiProperty({ description: "Agency ID" })
  id!: string;

  @ApiProperty({ description: "Agency name" })
  name!: string;

  @ApiProperty({ description: "Agency domain", required: false })
  domain?: string;

  @ApiProperty({ description: "Creation date" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date" })
  updatedAt!: Date;
}
