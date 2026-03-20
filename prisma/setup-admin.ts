import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = 'NathanLeMeilleur';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { id: 1 },
    update: { password: hashed },
    create: { id: 1, password: hashed },
  });

  console.log('Admin configuré avec succès.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
