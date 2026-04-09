import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync, writeFileSync } from "fs";

// Neon connection
const adapter = new PrismaPg({
  connectionString:
    "postgresql://neondb_owner:npg_z9oZ4ndveNjQ@ep-square-thunder-aj9y8ibs-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const prisma = new PrismaClient({ adapter });

async function importData() {
  try {
    // Read the exported data
    const data = JSON.parse(
      readFileSync("exported-production-scopes.json", "utf8"),
    );
    console.log(`Importing ${data.length} scopes to Neon...`);

    // Import each scope
    for (const scope of data) {
      await prisma.scope.create({
        data: {
          id: scope.id,
          userId: scope.user_id,
          input: scope.input,
          output: scope.output,
          title: scope.title,
          createdAt: new Date(scope.created_at),
        },
      });
    }

    console.log("Successfully imported all data to Neon!");

    // Verify the import
    const count = await prisma.scope.count();
    console.log(`Total scopes in Neon: ${count}`);
  } catch (error) {
    console.error("Import error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
