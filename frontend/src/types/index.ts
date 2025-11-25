export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  phone: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  assignedTo: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  employee?: {
    name: string;
    email: string;
    position: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
