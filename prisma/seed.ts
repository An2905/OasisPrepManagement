import {
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Intentionally empty: do not seed accounts or data in production.
  // Keep this file so `prisma db seed` is a no-op.
  console.log("Seed skipped.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

