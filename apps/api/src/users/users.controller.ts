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
import { UsersService } from "./users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  ChangePasswordDto,
} from "./dto/user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AgencyGuard } from "../auth/guards/agency.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "./dto/user.dto";
import { ApiResponseDto } from "../common/dto/api-response.dto";
import { AuthenticatedRequest } from "../common/interfaces/request.interface";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, AgencyGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const user = await this.usersService.create(
      createUserDto,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(user);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get all users for the agency" })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
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
    const result = await this.usersService.findAll(
      req.user.agencyId,
      req.user.id,
      page,
      limit,
    );
    return new ApiResponseDto(result.data, result.meta);
  }

  @Get(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT, UserRole.VIEWER)
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    const user = await this.usersService.findOne(
      id,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(user);
  }

  @Patch(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const user = await this.usersService.update(
      id,
      updateUserDto,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(user);
  }

  @Patch(":id/change-password")
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: "Change user password" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async changePassword(
    @Param("id") id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.usersService.changePassword(
      id,
      changePasswordDto,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(result);
  }

  @Delete(":id")
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    const result = await this.usersService.remove(
      id,
      req.user.agencyId,
      req.user.id,
    );
    return new ApiResponseDto(result);
  }
}
