const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    await db.category.deleteMany();

    return await db.category.createMany({
        data: [
            { name: "Famous People" },
            { name: "Movies & TV" },
            { name: "Musicians" },
            { name: "Entertainment" },
            { name: "Games" },
            { name: "Sports" },
            { name: "Philosophy" },
            { name: "Scientist" },
        ],
    });
}
main()
    .then((res) => console.table({ created: "success", ...res }))
    .catch(async (err) => console.log(console.log("Error seeding default categories", await err.message)))
    .finally(async () => await db.disconnect());
