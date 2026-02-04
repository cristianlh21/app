import { PrismaClient } from '@/generated/client/client' // Tu ruta de salida
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Creamos la conexión a PostgreSQL usando la librería 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter }) // <--- ¡Aquí está la magia!

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma