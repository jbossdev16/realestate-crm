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
import { LeadsService } from "./leads.service";
import { CreateLeadDto, UpdateLeadDto, LeadResponseDto } from "./dto/lead.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AgencyGuard } from "../auth/guards/agency.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/dto/user.dto";
import { ApiResponseDto } from "../common/dto/api-response.dto";
import { AuthenticatedRequest } from "../common/interfaces/request.interface";
import { LeadStatus } from "./dto/lead.dto";

@ApiTags("leads")
@Controller("leads")
@UseGuards(JwtAuthGuard, AgencyGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: "Create a new lead" })
  @ApiResponse({
    status: 201,
    description: "Lead created successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async create(
    @Body() createLeadDto: CreateLeadDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const lead = await this.leadsService.create(
      createLeadDto,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(lead);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get all leads for the agency" })
  @ApiResponse({ status: 200, description: "Leads retrieved successfully" })
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
    const result = await this.leadsService.findAll(
      req.user.agencyId,
      req.user.id,
      page,
      limit,
    );
    return new ApiResponseDto(result.data, result.meta);
  }

  @Get(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get a lead by ID" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({
    status: 200,
    description: "Lead retrieved successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    const lead = await this.leadsService.findOne(
      id,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(lead);
  }

  @Patch(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: "Update a lead" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({
    status: 200,
    description: "Lead updated successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async update(
    @Param("id") id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const lead = await this.leadsService.update(
      id,
      updateLeadDto,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(lead);
  }

  @Patch(":id/status")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: "Update lead status" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({
    status: 200,
    description: "Lead status updated successfully",
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: LeadStatus,
    @Request() req: AuthenticatedRequest,
  ) {
    const lead = await this.leadsService.updateStatus(
      id,
      status,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(lead);
  }

  @Delete(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: "Delete a lead" })
  @ApiParam({ name: "id", description: "Lead ID" })
  @ApiResponse({ status: 200, description: "Lead deleted successfully" })
  @ApiResponse({ status: 404, description: "Lead not found" })
  async remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    const result = await this.leadsService.remove(
      id,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(result);
  }
}
