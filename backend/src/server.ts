import express from 'express';
import itemRoutes from './routes/incus';
import config from './config/config';

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

app.listen(config.port, () => {
  console.log(`Local: http://127.0.0.1:${config.port}`);
});