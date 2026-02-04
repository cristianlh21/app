// Si lo generaste en src/generated/client
import { PrismaClient, Rol } from '../src/generated/client/client';
// Si el seed usa el adaptador de PG:
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// 1. CARGA DE VARIABLES
dotenv.config();

// 2. CONFIGURACIÓN DEL ADAPTADOR (A prueba de balas)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.empleado.upsert({
    where: { pin: '1234' },
    update: {},
    create: {
      nombre: 'Leonardo',
      apellido: 'Admin',
      documento: '12345678',
      cuil: '20123456789',
      rol: Rol.ADMIN,
      pin: '1234',
    },
  })
  console.log('✅ Usuario Admin creado con éxito. PIN: 1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })