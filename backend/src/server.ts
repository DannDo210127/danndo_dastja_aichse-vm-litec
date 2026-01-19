import express from 'express';
import config from './config/config';

import AuthentificationRouter from './routes/authentification';
import UserRouter from './routes/user';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ClassroomRouter from './routes/classroom';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

app.use(cookieParser())


app.use(express.json());

app.use('/auth', AuthentificationRouter);
app.use('/user', UserRouter);
app.use('/classroom', ClassroomRouter);


prisma.$connect().then(() => {
  console.log('Prisma ORM connected to database');
});

app.listen(config.port, () => {
  console.log(`Local: http://127.0.0.1:${config.port}`);
});