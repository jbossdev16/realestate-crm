import { PrismaClient } from '@prisma/client';

// Define enums locally until Prisma client is generated
enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN", 
  AGENT = "AGENT",
  VIEWER = "VIEWER"
}

enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  VIEWING_BOOKED = "VIEWING_BOOKED",
  OFFER_MADE = "OFFER_MADE",
  CLOSED = "CLOSED",
  LOST = "LOST"
}
import { prisma } from '../src/client';
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting seed...');

  // Create agency
  const agency = await prisma.agency.upsert({
    where: { domain: 'demo.local' },
    update: {},
    create: {
      name: 'Demo Real Estate Agency',
      domain: 'demo.local',
    },
  });

  console.log('✅ Created agency:', agency.name);

  // Create user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { 
      email_agencyId: {
        email: 'admin@demo.local',
        agencyId: agency.id
      }
    },
    update: {},
    create: {
      email: 'admin@demo.local',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.OWNER,
      agencyId: agency.id,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
        status: LeadStatus.NEW,
        source: 'Website',
        notes: 'Interested in 3-bedroom houses',
        agencyId: agency.id,
        assignedTo: user.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        phone: '+1987654321',
        status: LeadStatus.CONTACTED,
        source: 'Referral',
        notes: 'Looking for investment properties',
        agencyId: agency.id,
        assignedTo: user.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Carol',
        lastName: 'Williams',
        email: 'carol@example.com',
        phone: '+1555123456',
        status: LeadStatus.QUALIFIED,
        source: 'Social Media',
        notes: 'Ready to buy, budget $500k',
        agencyId: agency.id,
        assignedTo: user.id,
      },
    }),
  ]);

  console.log('✅ Created leads:', leads.length);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
