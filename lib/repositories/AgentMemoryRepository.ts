import { prisma } from '../prisma';

export class AgentMemoryRepository {
  async create(data: any) {
    return prisma.agentMemory.create({ data });
  }

  async findById(id: string) {
    return prisma.agentMemory.findUnique({ where: { id } });
  }

  async findByUserId(userId: string) {
    return prisma.agentMemory.findMany({ where: { userId } });
  }

  async findByProjectId(projectId: string) {
    return prisma.agentMemory.findMany({ where: { projectId } });
  }

  async findByType(type: string) {
    return prisma.agentMemory.findMany({ where: { type } });
  }

  async findAll() {
    return prisma.agentMemory.findMany();
  }

  async update(id: string, data: any) {
    return prisma.agentMemory.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.agentMemory.delete({ where: { id } });
  }
}
