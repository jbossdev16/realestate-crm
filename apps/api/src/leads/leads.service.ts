import { Injectable } from "@nestjs/common";
import {
  NotFoundException,
  ForbiddenException,
} from "../common/exceptions/crm.exception";
import { prisma } from "@realestate-crm/db";
import { CreateLeadDto, UpdateLeadDto } from "./dto/lead.dto";
import { LeadStatus } from "./dto/lead.dto";

@Injectable()
export class LeadsService {
  async create(createLeadDto: CreateLeadDto, agencyId: string, userId: string) {
    // Verify user has access to this agency
    const user = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("Access denied to this agency");
    }

    // If assignedTo is provided, verify the assigned user exists in the same agency
    if (createLeadDto.assignedTo) {
      const assignedUser = await prisma.user.findFirst({
        where: { id: createLeadDto.assignedTo, agencyId, deletedAt: null },
      });

      if (!assignedUser) {
        throw new ForbiddenException("Assigned user not found in this agency");
      }
    }

    const lead = await prisma.lead.create({
      data: {
        ...createLeadDto,
        agencyId,
        assignedTo: createLeadDto.assignedTo || userId, // Default to current user if not assigned
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return lead;
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

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: { agencyId, deletedAt: null },
        include: {
          assignedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({
        where: { agencyId, deletedAt: null },
      }),
    ]);

    return {
      data: leads,
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

    const lead = await prisma.lead.findFirst({
      where: { id, agencyId, deletedAt: null },
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException("Lead", id);
    }

    return lead;
  }

  async update(
    id: string,
    updateLeadDto: UpdateLeadDto,
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

    // Check if lead exists and belongs to agency
    const existingLead = await prisma.lead.findFirst({
      where: { id, agencyId, deletedAt: null },
    });

    if (!existingLead) {
      throw new NotFoundException("Lead", id);
    }

    // If assignedTo is provided, verify the assigned user exists in the same agency
    if (updateLeadDto.assignedTo) {
      const assignedUser = await prisma.user.findFirst({
        where: { id: updateLeadDto.assignedTo, agencyId, deletedAt: null },
      });

      if (!assignedUser) {
        throw new ForbiddenException("Assigned user not found in this agency");
      }
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return lead;
  }

  async remove(id: string, agencyId: string, userId: string) {
    // Verify user has access to this agency
    const user = await prisma.user.findFirst({
      where: { id: userId, agencyId, deletedAt: null },
    });

    if (!user) {
      throw new ForbiddenException("Access denied to this agency");
    }

    // Check if lead exists and belongs to agency
    const existingLead = await prisma.lead.findFirst({
      where: { id, agencyId, deletedAt: null },
    });

    if (!existingLead) {
      throw new NotFoundException("Lead", id);
    }

    // Soft delete
    await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "Lead deleted successfully" };
  }

  async updateStatus(
    id: string,
    status: LeadStatus,
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

    // Check if lead exists and belongs to agency
    const existingLead = await prisma.lead.findFirst({
      where: { id, agencyId, deletedAt: null },
    });

    if (!existingLead) {
      throw new NotFoundException("Lead", id);
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return lead;
  }
}
