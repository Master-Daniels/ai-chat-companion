import { PrismaClient } from "@prisma/client";

const globalThis = global as typeof global & {
    prisma: PrismaClient | undefined;
};

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV != "production") globalThis.prisma = prisma;

export default prisma;
