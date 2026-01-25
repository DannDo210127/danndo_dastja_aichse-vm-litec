import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";

const prisma = DatabaseClient.getInstance().prisma;

