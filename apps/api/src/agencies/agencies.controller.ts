import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { AgenciesService } from "./agencies.service";
import {
  CreateAgencyDto,
  UpdateAgencyDto,
  AgencyResponseDto,
} from "./dto/agency.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AgencyGuard } from "../auth/guards/agency.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/dto/user.dto";
import { ApiResponseDto } from "../common/dto/api-response.dto";
import { AuthenticatedRequest } from "../common/interfaces/request.interface";

@ApiTags("agencies")
@Controller("agencies")
@UseGuards(JwtAuthGuard, AgencyGuard)
@ApiBearerAuth()
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: "Create a new agency" })
  @ApiResponse({
    status: 201,
    description: "Agency created successfully",
    type: AgencyResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({
    status: 409,
    description: "Agency with this domain already exists",
  })
  async create(
    @Body() createAgencyDto: CreateAgencyDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const agency = await this.agenciesService.create(
      createAgencyDto,
      req.user.id,
    );
    return new ApiResponseDto(agency);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get all agencies accessible to the user" })
  @ApiResponse({ status: 200, description: "Agencies retrieved successfully" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page",
  })
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const result = await this.agenciesService.findAll(req.user.id, page, limit);
    return new ApiResponseDto(result.data, result.meta);
  }

  @Get(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get an agency by ID" })
  @ApiParam({ name: "id", description: "Agency ID" })
  @ApiResponse({
    status: 200,
    description: "Agency retrieved successfully",
    type: AgencyResponseDto,
  })
  @ApiResponse({ status: 404, description: "Agency not found" })
  async findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    const agency = await this.agenciesService.findOne(id, req.user.id);
    return new ApiResponseDto(agency);
  }

  @Get(":id/stats")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get agency statistics" })
  @ApiParam({ name: "id", description: "Agency ID" })
  @ApiResponse({
    status: 200,
    description: "Agency statistics retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Agency not found" })
  async getStats(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const stats = await this.agenciesService.getAgencyStats(id, req.user.id);
    return new ApiResponseDto(stats);
  }

  @Patch(":id")
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: "Update an agency" })
  @ApiParam({ name: "id", description: "Agency ID" })
  @ApiResponse({
    status: 200,
    description: "Agency updated successfully",
    type: AgencyResponseDto,
  })
  @ApiResponse({ status: 404, description: "Agency not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async update(
    @Param("id") id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const agency = await this.agenciesService.update(
      id,
      updateAgencyDto,
      req.user.id,
    );
    return new ApiResponseDto(agency);
  }

  @Delete(":id")
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: "Delete an agency" })
  @ApiParam({ name: "id", description: "Agency ID" })
  @ApiResponse({ status: 200, description: "Agency deleted successfully" })
  @ApiResponse({ status: 404, description: "Agency not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({
    status: 409,
    description: "Cannot delete agency with existing users",
  })
  async remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    const result = await this.agenciesService.remove(id, req.user.id);
    return new ApiResponseDto(result);
  }
}
