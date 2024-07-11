import { Priority } from "@prisma/client";

/**
 * Interface to specify the data that can be used during Todo entries data CRUD operations
 */
export interface TodoData {
  title: string;
  description: string;
  priority: Priority;
  day: {
    connect: {
      id: number;
    };
  };
  completed?: boolean;
  completedAt?: string | null;
}
