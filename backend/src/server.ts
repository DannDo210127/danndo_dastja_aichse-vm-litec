import express from 'express';
import config from './config/config';
import { PrismaClient } from '../generated/prisma/client';

import AuthentificationRouter from './routes/authentification';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use('/auth', AuthentificationRouter);

prisma.$connect().then(() => {
  console.log('Prisma ORM connected to database');
});

app.listen(config.port, () => {
  console.log(`Local: http://127.0.0.1:${config.port}`);
});