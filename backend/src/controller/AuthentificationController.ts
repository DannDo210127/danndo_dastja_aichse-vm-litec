import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { generateAccessToken, generateRefreshToken } from "../auth/token";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { errorMessage } from "../util/Error";

const prisma = DatabaseClient.getInstance().prisma;


const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Days

/**
 * Login a user and provide access and refresh tokens.
 * 
 * Route: POST /auth/login
 */
const login: RequestHandler = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json(errorMessage(101, 'Email and password are required'));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    }
  });

  if (!user) {
    return res.status(401).json(errorMessage(102, 'User not found'));
  }

  if (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(401).json(errorMessage(103, 'Password wrong'));
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
      expiresAt: refreshTokenExpiry
    }
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiry.getTime() - Date.now(),
  })

  res.send({ accessToken });
}

/**
 * Register a new user.
 * 
 * Route: POST /auth/register
 */
const register: RequestHandler = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    return res.status(400).json(errorMessage(104, 'First name, last name, email and password are required'));
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = await bcrypt.hash(req.body.password, salt);

  // create new user
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: passwordHash,

    // TODO: Default ADMIN role
    roleId: 1,
  }

  const createdUser: User = await prisma.user.create({
    data: user
  });

  const accessToken = generateAccessToken(createdUser.id);
  const refreshToken = generateRefreshToken(createdUser.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiry.getTime() - Date.now(),
  })

  res.status(201).json({ accessToken });
}

/**
 * Generate a new access token using the refresh token
 * 
 * Route: POST /auth/token
 */
const token: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  const validToken = await prisma.token.findFirst({
    where: {
      token: refreshToken
    }
  })

  if (!validToken) return res.sendStatus(403); // Forbidden

  if (validToken?.token == refreshToken) {
    const accessToken = generateAccessToken(validToken!.userId);

    res.send({ accessToken });
  }
} 

/**
 * Logout a user by deleting the refresh token
 * 
 * Route: POST /auth/logout
 */
const logout: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken)
    return res.sendStatus(400).json(errorMessage(105, 'Refresh token is required'));

  try {
    await prisma.token.delete({
      where: { token: refreshToken }
    })
  } catch (error) {
    res.sendStatus(400).json(errorMessage(106, 'Something went wrong during logout'));
  }
  
  res.cookie("refreshToken", "", {
    httpOnly: true,
    maxAge: 0,
  })

  res.sendStatus(200).send('Logged out successfully');
} 

export {
  login,
  register,
  token,
  logout
};