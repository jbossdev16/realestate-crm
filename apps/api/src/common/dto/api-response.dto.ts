import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: "Response data" })
  data!: T;

  @ApiProperty({ description: "Response metadata", required: false })
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };

  @ApiProperty({ description: "Error information", required: false })
  error?: {
    code: string;
    message: string;
    details?: any;
  };

  constructor(data: T, meta?: any, error?: any) {
    this.data = data;
    this.meta = meta;
    this.error = error;
  }
}

export class PaginationMetaDto {
  @ApiProperty({ description: "Total number of items" })
  total!: number;

  @ApiProperty({ description: "Current page number" })
  page!: number;

  @ApiProperty({ description: "Items per page" })
  limit!: number;

  @ApiProperty({ description: "Whether there is a next page" })
  hasNext!: boolean;

  @ApiProperty({ description: "Whether there is a previous page" })
  hasPrev!: boolean;
}
