import { PrismaClient } from "@prisma/client";

class DatabaseClient {
     public prisma: PrismaClient;
     private static instance: DatabaseClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance(): DatabaseClient {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new DatabaseClient();
        }

        return DatabaseClient.instance;
    }
}

export default DatabaseClient;