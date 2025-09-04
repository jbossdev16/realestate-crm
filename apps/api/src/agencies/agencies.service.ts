import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { prisma } from "@realestate-crm/db";
import { CreateAgencyDto, UpdateAgencyDto } from "./dto/agency.dto";
import { UserRole } from "../users/dto/user.dto";

@Injectable()
export class AgenciesService {
  async create(createAgencyDto: CreateAgencyDto, userId: string) {
    // Only OWNER role can create agencies (in a multi-tenant system, this might be restricted further)
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    // Check if domain is unique if provided
    if (createAgencyDto.domain) {
      const existingAgency = await prisma.agency.findFirst({
        where: { domain: createAgencyDto.domain, deletedAt: null },
      });

      if (existingAgency) {
        throw new ConflictException("Agency with this domain already exists");
      }
    }

    const agency = await prisma.agency.create({
      data: createAgencyDto,
    });

    return agency;
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    const skip = (page - 1) * limit;

    // For now, users can only see their own agency
    // In a super-admin system, you might want to show all agencies
    const [agencies, total] = await Promise.all([
      prisma.agency.findMany({
        where: {
          id: user.agencyId,
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.agency.count({
        where: {
          id: user.agencyId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: agencies,
      meta: {
        total,
        page,
        limit,
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    // Users can only access their own agency
    if (id !== user.agencyId) {
      throw new ForbiddenException("Access denied to this agency");
    }

    const agency = await prisma.agency.findFirst({
      where: { id, deletedAt: null },
    });

    if (!agency) {
      throw new NotFoundException("Agency", id);
    }

    return agency;
  }

  async update(id: string, updateAgencyDto: UpdateAgencyDto, userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    // Only OWNER can update agency details
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException(
        "Only agency owners can update agency details",
      );
    }

    // Users can only update their own agency
    if (id !== user.agencyId) {
      throw new ForbiddenException("Access denied to this agency");
    }

    const agency = await prisma.agency.findFirst({
      where: { id, deletedAt: null },
    });

    if (!agency) {
      throw new NotFoundException("Agency", id);
    }

    // Check if domain is unique if being updated
    if (updateAgencyDto.domain && updateAgencyDto.domain !== agency.domain) {
      const existingAgency = await prisma.agency.findFirst({
        where: {
          domain: updateAgencyDto.domain,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existingAgency) {
        throw new ConflictException("Agency with this domain already exists");
      }
    }

    const updatedAgency = await prisma.agency.update({
      where: { id },
      data: updateAgencyDto,
    });

    return updatedAgency;
  }

  async remove(id: string, userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    // Only OWNER can delete agency
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException("Only agency owners can delete agencies");
    }

    // Users can only delete their own agency
    if (id !== user.agencyId) {
      throw new ForbiddenException("Access denied to this agency");
    }

    const agency = await prisma.agency.findFirst({
      where: { id, deletedAt: null },
    });

    if (!agency) {
      throw new NotFoundException("Agency", id);
    }

    // Check if agency has users
    const userCount = await prisma.user.count({
      where: { agencyId: id, deletedAt: null },
    });

    if (userCount > 0) {
      throw new ConflictException("Cannot delete agency with existing users");
    }

    // Soft delete
    await prisma.agency.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "Agency deleted successfully" };
  }

  async getAgencyStats(id: string, userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    // Users can only access their own agency stats
    if (id !== user.agencyId) {
      throw new ForbiddenException("Access denied to this agency");
    }

    const agency = await prisma.agency.findFirst({
      where: { id, deletedAt: null },
    });

    if (!agency) {
      throw new NotFoundException("Agency", id);
    }

    const [userCount, leadCount, leadsByStatus] = await Promise.all([
      prisma.user.count({
        where: { agencyId: id, deletedAt: null },
      }),
      prisma.lead.count({
        where: { agencyId: id, deletedAt: null },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        where: { agencyId: id, deletedAt: null },
        _count: { status: true },
      }),
    ]);

    return {
      agency,
      stats: {
        totalUsers: userCount,
        totalLeads: leadCount,
        leadsByStatus: leadsByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
    };
  }
}
