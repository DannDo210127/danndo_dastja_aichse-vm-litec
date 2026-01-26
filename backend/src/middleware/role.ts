import { NextFunction, Request, Response } from 'express';
import DatabaseClient from '../db/client';
import { errorMessage } from '../util/Error';

const prisma = DatabaseClient.getInstance().prisma;


export const hasPermission = (flags: string[]) => {
  return async(req: Request, res: Response, next: NextFunction) => {

    const userFlags = await prisma.flag.findMany({
        where: {
            roleId: req.user?.roleId,
        }
    })
    
    const userFlagValues = userFlags.map(flag => flag.value);
    const hasPermission = flags.every(flag => userFlagValues.includes(flag));
    
    if(!hasPermission) {
        return res.status(403).json(errorMessage(4, 'Insufficient permissions: ' + flags.join(', ')));
    }

    next();
  };
};