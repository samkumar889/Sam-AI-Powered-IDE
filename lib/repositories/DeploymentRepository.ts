import { prisma } from '../prisma';

export class DeploymentRepository {
  async create(data: any) {
    return prisma.deployment.create({ data });
  }

  async findById(id: string) {
    return prisma.deployment.findUnique({ where: { id } });
  }

  async findByProjectId(projectId: string) {
    return prisma.deployment.findMany({ where: { projectId } });
  }

  async findByUserId(userId: string) {
    return prisma.deployment.findMany({ where: { userId } });
  }

  async findAll() {
    return prisma.deployment.findMany();
  }

  async update(id: string, data: any) {
    return prisma.deployment.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.deployment.delete({ where: { id } });
  }
}
