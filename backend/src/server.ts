import express from "express";
import config from "./config/config";

import AuthentificationRouter from "./routes/authentification";
import UserRouter from "./routes/user";
import IncusRouter from "./routes/incus";
import cors from "cors";
import cookieParser from "cookie-parser";
import ClassroomRouter from "./routes/classroom";
import { PrismaClient } from "@prisma/client";
import { testIncusConnection } from "./incus/client";

const prisma = new PrismaClient();
const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true
	})
);

app.use(cookieParser());

app.use(express.json());

// All Routes
app.use("/auth", AuthentificationRouter);
app.use("/user", UserRouter);
app.use("/incus", IncusRouter);
app.use("/classroom", ClassroomRouter);

// Initialize database connection
prisma
	.$connect()
	.then(() => {
		console.log(
			"\x1b[36m✓ \x1b[32mPrismaORM\x1b[36m: connected & authenticated\x1b[0m"
		);
	})
	.catch((error) => {
		console.error(
			"\x1b[36m✗ \x1b[31mPrismaORM\x1b[36m: Failed to connect to database\x1b[0m"
		);
	});

// Test Incus connection
testIncusConnection();

// Start server
const PORT = config.port;
app.listen(PORT, () => {
	console.log(
		"\x1b[36m✓ \x1b[32mVirtual-Classroom API\x1b[36m: Running on http://localhost:" +
			PORT +
			"\x1b[0m"
	);
});
