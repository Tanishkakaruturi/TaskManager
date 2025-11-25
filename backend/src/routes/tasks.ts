import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  assignedTo: z.number().int().positive(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime(),
  estimatedHours: z.number().int().positive(),
  actualHours: z.number().int().positive().optional()
});

router.get('/', async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = parseInt(assignedTo as string);

    const tasks = await prisma.task.findMany({
      where,
      include: {
        employee: {
          select: { name: true, email: true, position: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = taskSchema.parse(req.body);
    const task = await prisma.task.create({
      data,
      include: {
        employee: {
          select: { name: true, email: true, position: true }
        }
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid task data' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = taskSchema.partial().parse(req.body);
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: {
        employee: {
          select: { name: true, email: true, position: true }
        }
      }
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid task data' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

export default router;
