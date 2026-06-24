import { prisma } from '../prisma.js';

export class ConversationRepository {
  async create(data: any) {
    return prisma.conversation.create({ data });
  }

  async findById(id: string) {
    return prisma.conversation.findUnique({ where: { id } });
  }

  async findByUserId(userId: string) {
    return prisma.conversation.findMany({ where: { userId } });
  }

  async findByProjectId(projectId: string) {
    return prisma.conversation.findMany({ where: { projectId } });
  }

  async findAll() {
    return prisma.conversation.findMany();
  }

  async update(id: string, data: any) {
    return prisma.conversation.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.conversation.delete({ where: { id } });
  }
}
