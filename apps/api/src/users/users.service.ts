import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { prisma } from "@realestate-crm/db";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from "./dto/user.dto";
import { UserRole } from "./dto/user.dto";

@Injectable()
export class UsersService {
  async create(
    createUserDto: CreateUserDto,
    agencyId: string,
    currentUserId: string,
  ) {
    // Verify current user has access to this agency and can create users
    const currentUser = await prisma.user.findFirst({
      where: { id: currentUserId, agencyId, deletedAt: null },
    });

    if (!currentUser) {
      throw new ForbiddenException("Access denied to this agency");
    }

    // Only OWNER and ADMIN can create users
    if (
      currentUser.role !== UserRole.OWNER &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException("Insufficient permissions to create users");
    }

    // Check if user already exists in this agency
    const existingUser = await prisma.user.findFirst({
      where: {
        email: createUserDto.email,
        agencyId: createUserDto.agencyId,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        "User with this email already exists in this agency",
      );
    }

    // Verify the target agency exists and user has access to it
    if (createUserDto.agencyId !== agencyId) {
      throw new ForbiddenException("Cannot create users in different agency");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password: _password, ...result } = user;
    return result;
  }

  async findAll(
    agencyId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    // Verify user has access to this agency
    const user = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("Access denied to this agency");
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { agencyId, deletedAt: null },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          agencyId: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({
        where: { agencyId, deletedAt: null },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string, agencyId: string, userId: string) {
    // Verify user has access to this agency
    const user = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("Access denied to this agency");
    }

    const targetUser = await prisma.user.findFirst({
      where: { id, agencyId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        agencyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException("User", id);
    }

    return targetUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    agencyId: string,
    userId: string,
  ) {
    // Verify current user has access to this agency
    const currentUser = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!currentUser) {
      throw new ForbiddenException("Access denied to this agency");
    }

    // Check if target user exists and belongs to agency
    const targetUser = await prisma.user.findFirst({
      where: { id, agencyId, deletedAt: null },
    });

    if (!targetUser) {
      throw new NotFoundException("User", id);
    }

    // Permission checks
    const isUpdatingSelf = id === userId;
    const canUpdateRole =
      currentUser.role === UserRole.OWNER ||
      currentUser.role === UserRole.ADMIN;
    const canUpdateOthers =
      currentUser.role === UserRole.OWNER ||
      currentUser.role === UserRole.ADMIN;

    // Only OWNER and ADMIN can update other users
    if (!isUpdatingSelf && !canUpdateOthers) {
      throw new ForbiddenException(
        "Insufficient permissions to update other users",
      );
    }

    // Only OWNER and ADMIN can change roles
    if (updateUserDto.role && !canUpdateRole) {
      throw new ForbiddenException(
        "Insufficient permissions to change user role",
      );
    }

    // OWNER cannot be demoted
    if (
      targetUser.role === UserRole.OWNER &&
      updateUserDto.role &&
      updateUserDto.role !== UserRole.OWNER
    ) {
      throw new ForbiddenException("Cannot change owner role");
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== targetUser.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          agencyId,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException(
          "User with this email already exists in this agency",
        );
      }
    }

    const updateData: any = { ...updateUserDto };

    // Hash password if provided
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        agencyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async remove(id: string, agencyId: string, userId: string) {
    // Verify current user has access to this agency
    const currentUser = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!currentUser) {
      throw new ForbiddenException("Access denied to this agency");
    }

    // Check if target user exists and belongs to agency
    const targetUser = await prisma.user.findFirst({
      where: { id, agencyId, deletedAt: null },
    });

    if (!targetUser) {
      throw new NotFoundException("User", id);
    }

    // Only OWNER and ADMIN can delete users
    if (
      currentUser.role !== UserRole.OWNER &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException("Insufficient permissions to delete users");
    }

    // Cannot delete self
    if (id === userId) {
      throw new ForbiddenException("Cannot delete your own account");
    }

    // Cannot delete owner
    if (targetUser.role === UserRole.OWNER) {
      throw new ForbiddenException("Cannot delete agency owner");
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "User deleted successfully" };
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
    agencyId: string,
    userId: string,
  ) {
    // Verify user has access to this agency
    const user = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("Access denied to this agency");
    }

    // Can only change own password unless admin/owner
    const isChangingOwnPassword = id === userId;
    const canChangeOthersPassword =
      user.role === UserRole.OWNER || user.role === UserRole.ADMIN;

    if (!isChangingOwnPassword && !canChangeOthersPassword) {
      throw new ForbiddenException(
        "Insufficient permissions to change other users' passwords",
      );
    }

    // Check if target user exists and belongs to agency
    const targetUser = await prisma.user.findFirst({
      where: { id, agencyId, deletedAt: null },
    });

    if (!targetUser) {
      throw new NotFoundException("User", id);
    }

    // Verify current password if changing own password
    if (isChangingOwnPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        targetUser.password || "",
      );
      if (!isCurrentPasswordValid) {
        throw new ForbiddenException("Current password is incorrect");
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully" };
  }
}
