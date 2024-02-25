const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const catgories = await database.category.createMany({
      data: [
        {
          name: "Computer science",
        },

        {
          name: "Photography",
        },
        {
          name: "Accounting",
        },
        {
          name: "Engineering",
        },
        {
          name: "DevOps",
        },
        {
          name: "Filming",
        },
      ],
    });
    console.log("success");
  } catch (error) {
    console.log("Error seeding the categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();