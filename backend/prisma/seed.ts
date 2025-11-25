import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { email: 'john.smith@company.com' },
      update: {},
      create: {
        name: 'John Smith',
        email: 'john.smith@company.com',
        position: 'Frontend Developer',
        department: 'Engineering',
        hireDate: new Date('2022-01-15'),
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'ACTIVE'
      }
    }),
    prisma.employee.upsert({
      where: { email: 'sarah.j@company.com' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        position: 'UI/UX Designer',
        department: 'Design',
        hireDate: new Date('2021-03-20'),
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        status: 'ACTIVE'
      }
    })
  ]);

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Implement User Authentication',
        description: 'Create login and registration pages with form validation',
        assignedTo: employees[0].id,
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2024-01-15'),
        estimatedHours: 8,
        actualHours: 7
      },
      {
        title: 'Design Dashboard Layout',
        description: 'Create wireframes and mockups for the main dashboard',
        assignedTo: employees[1].id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date('2024-01-20'),
        estimatedHours: 12,
        actualHours: 6
      }
    ]
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
