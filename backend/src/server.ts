import express from 'express';
import config from './config/config';
import { PrismaClient } from '../generated/prisma/client';

import AuthentificationRouter from './routes/authentification';
import UserRouter from './routes/user';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use('/auth', AuthentificationRouter);
app.use('/user', UserRouter);

prisma.$connect().then(() => {
  console.log('Prisma ORM connected to database');
});

app.listen(config.port, () => {
  console.log(`Local: http://127.0.0.1:${config.port}`);
});