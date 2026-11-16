import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryFindingsDto } from './dto/query-findings.dto';

@Injectable()
export class FindingsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: QueryFindingsDto) {
    const where: Prisma.FindingWhereInput = {
      ...(q.severity && { severity: q.severity }),
      ...(q.status && { status: q.status }),
      ...(q.search && { title: { contains: q.search, mode: 'insensitive' } }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.finding.findMany({
        where,
        orderBy: { firstSeen: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { project: { select: { name: true } } },
      }),
      this.prisma.finding.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  }

  async summary() {
    const rows = await this.prisma.finding.groupBy({
      by: ['severity'],
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
      _count: true,
    });
    return rows.map((r) => ({ severity: r.severity, count: r._count }));
  }

  async updateStatus(id: number, status: Status, actor: string) {
    const current = await this.prisma.finding.findUnique({ where: { id } });
    if (!current) throw new NotFoundException();
    const [updated] = await this.prisma.$transaction([
      this.prisma.finding.update({ where: { id }, data: { status } }),
      this.prisma.auditLog.create({
        data: { findingId: id, fromStatus: current.status, toStatus: status, actor },
      }),
    ]);
    return updated;
  }
}