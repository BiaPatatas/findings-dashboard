import { PrismaClient, Severity, Status } from '@prisma/client';
const prisma = new PrismaClient();

const titles = [
  'Unprotected debug interface', 'Weak key derivation', 'Missing secure boot check',
  'Side-channel leakage in AES core', 'Hardcoded test key', 'Insufficient entropy in RNG',
  'Unlocked JTAG port', 'Fault injection susceptibility',
];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.project.deleteMany();

  const names = ['AES-Core IP', 'PUF Module', 'Secure Boot ROM', 'Crypto Accelerator'];
  const projects = await Promise.all(
    names.map((name) => prisma.project.create({ data: { name } })),
  );

  const severities = Object.values(Severity);
  const statuses = Object.values(Status);
  const data = Array.from({ length: 2000 }, (_, i) => ({
    title: `${pick(titles)} #${i + 1}`,
    description: 'Auto-generated demo finding.',
    severity: pick(severities),
    status: pick(statuses),
    projectId: pick(projects).id,
    firstSeen: new Date(Date.now() - Math.random() * 90 * 24 * 3600 * 1000),
  }));
  await prisma.finding.createMany({ data });
}
main().finally(() => prisma.$disconnect());