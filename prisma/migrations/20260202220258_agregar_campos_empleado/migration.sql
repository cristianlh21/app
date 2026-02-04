-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'RECEPCIONISTA', 'MUCAMA', 'MOZO', 'COCINERO');

-- CreateTable
CREATE TABLE "Empleado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "cuil" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'RECEPCIONISTA',
    "pin" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "fotoUrl" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_documento_key" ON "Empleado"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_cuil_key" ON "Empleado"("cuil");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_pin_key" ON "Empleado"("pin");
