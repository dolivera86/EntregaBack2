import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import checkoutRouter from './routes/checkoutRouter.js';
import ticketsRouter from './routes/ticketsRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';
import './config/passport.config.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

// Configuración
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:7000',
  credentials: true
}));

// View
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(__dirname + '/../public'));

// Rutas
app.use('/', viewsRouter);
app.use('/api/sessions', authRoutes);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/checkout', checkoutRouter);
app.use('/api/tickets', ticketsRouter);
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date() }));

// Manejo de errores
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Conexión a MongoDB
const PORT = parseInt(process.env.PORT) || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    const httpServer = app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

    // Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:8000',
        credentials: true
      }
    });

    websocket(io);
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;