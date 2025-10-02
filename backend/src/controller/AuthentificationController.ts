import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { generateAccessToken, generateRefreshToken } from "../auth/token";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = DatabaseClient.getInstance().prisma;

/**
 * Login a user and return generated JWT token 
 * @returns 
 */
const login: RequestHandler = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    }
  });

  if (!user) {
    return res.status(401).json({ message: 'Auth failed' });
  }

  if (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(401).json({ message: 'Password wronge' });
  }

  // Delete all old Tokens
  await prisma.token.deleteMany({
    where: {
      userId: user?.id
    }
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.token.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Days
    }
  });

  res.json({ accessToken, refreshToken });
}

const register: RequestHandler = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'First name, last name, email and password are required' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = await bcrypt.hash(req.body.password, salt);

  // create new user
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: passwordHash,

    // Default ADMIN role
    roleId: 1,
  }

  const createdUser: User = await prisma.user.create({
    data: user
  });

  res.status(201).json(createdUser);
}

/**
 * Route to generate new access token using refresh token 
 * @returns 
 */
const token: RequestHandler = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  const validToken = await prisma.token.findFirst({
    where: {
      token: refreshToken
    }
  })

  if (!validToken) return res.sendStatus(403); // Forbidden

  if (validToken?.token == refreshToken) {
    const accessToken = generateAccessToken(validToken!.userId);
    res.json({ accessToken });
  }
} 

export {
  login,
  register,
  token
};