import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import DatabaseClient from "../db/client";

const prisma = DatabaseClient.getInstance().prisma;

const login: RequestHandler = async (req, res) => {
  res.send('Login route');
}

const register: RequestHandler = async (req, res) => {
  res.send('Login route');
}

export {
  login,
};