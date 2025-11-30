import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
