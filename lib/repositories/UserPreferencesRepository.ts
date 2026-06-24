import { prisma } from '../prisma.js';

export class UserPreferencesRepository {
  async create(data: any) {
    return prisma.userPreferences.create({ data });
  }

  async findById(id: string) {
    return prisma.userPreferences.findUnique({ where: { id } });
  }

  async findByUserId(userId: string) {
    return prisma.userPreferences.findUnique({ where: { userId } });
  }

  async findAll() {
    return prisma.userPreferences.findMany();
  }

  async update(id: string, data: any) {
    return prisma.userPreferences.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.userPreferences.delete({ where: { id } });
  }
}
