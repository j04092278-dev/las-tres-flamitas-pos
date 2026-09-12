import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Error:', err.message || err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Error interno del servidor'
      : err.message || 'Error desconocido';
  res.status(status).json({ error: message });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};