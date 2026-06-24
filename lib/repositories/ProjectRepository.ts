import { prisma } from '../prisma';

export class ProjectRepository {
  async create(data: any) {
    return prisma.project.create({ data });
  }

  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  }

  async findByOwnerId(ownerId: string) {
    return prisma.project.findMany({ where: { ownerId } });
  }

  async findAll() {
    return prisma.project.findMany();
  }

  async update(id: string, data: any) {
    return prisma.project.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
