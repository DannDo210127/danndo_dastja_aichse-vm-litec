import jwt from 'jsonwebtoken';
import { User } from '../../generated/prisma';
import { NextFunction, Request, Response } from 'express';
import DatabaseClient from '../db/client';

const prisma = DatabaseClient.getInstance().prisma;

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string, async (err: any, userId: any) => {

    // Access token has expired or is invalid
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    const user = await prisma.user.findUnique({
      where: { id: userId.id }
    });

    if (!user) {
      return res.sendStatus(404).send('User not found');
    }

    req.user = user;

    next();
  });
};