import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const PaginationDtoSchema = z.object({
  page: z.number().int().positive().min(1).optional().default(1),
  limit: z.number().int().positive().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const CursorPaginationDtoSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().positive().min(1).max(100).optional().default(10),
});

export class PaginationDto {
  @ApiProperty({
    description: "Page number",
    minimum: 1,
    default: 1,
    required: false,
  })
  page?: number = 1;

  @ApiProperty({
    description: "Items per page",
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  limit?: number = 10;

  @ApiProperty({ description: "Sort field", required: false })
  sortBy?: string;

  @ApiProperty({
    description: "Sort order",
    enum: ["asc", "desc"],
    required: false,
  })
  sortOrder?: "asc" | "desc" = "desc";
}

export class CursorPaginationDto {
  @ApiProperty({ description: "Cursor for pagination", required: false })
  cursor?: string;

  @ApiProperty({
    description: "Items per page",
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  limit?: number = 10;
}
