import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const employeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  position: z.string().min(2),
  department: z.string().min(2),
  hireDate: z.string().datetime(),
  phone: z.string().min(10),
  avatar: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
});

router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { tasks: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = employeeSchema.parse(req.body);
    const employee = await prisma.employee.create({ data });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Invalid employee data' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = employeeSchema.partial().parse(req.body);
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Invalid employee data' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Employee not found' });
  }
});

export default router;
