import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import DatabaseClient from "../db/client";
import { User } from "../../generated/prisma";
import { generateAccessToken, generateRefreshToken } from "../auth/token";

const prisma = DatabaseClient.getInstance().prisma;

/**
 * Login a user and return generated JWT token 
 * @returns 
 */
const login: RequestHandler = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  });

  if (!user) {
    return res.status(401).json({ message: 'Auth failed' });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({ accessToken, refreshToken });
}

const register: RequestHandler = async (req, res) => {
  // create new user
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  }

  const createdUser: User = await prisma.user.create({
    data: user
  });

  res.status(201).json(createdUser);
}

const token: RequestHandler = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  jwt.verify(refreshToken, process.env.JWT_ACCESS_TOKEN_SECRET as string, (err: any, userId: any) => {
    if (err) return res.sendStatus(403); // Forbidden
    
    const accessToken = generateAccessToken(userId.id);
    res.json({ accessToken });
  });
} 

export {
  login,
  register,
  token
};