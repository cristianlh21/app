/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Empleado` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Piso" AS ENUM ('PLANTA_BAJA', 'PRIMER_PISO', 'SEGUNDO_PISO', 'TERCER_PISO', 'CUARTO_PISO');

-- CreateEnum
CREATE TYPE "Disponibilidad" AS ENUM ('LIBRE', 'OCUPADA');

-- CreateEnum
CREATE TYPE "EstadoLimpieza" AS ENUM ('LIMPIA', 'SUCIA', 'EN_MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'CHECK_IN', 'CHECK_OUT', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA_DEBITO', 'TARJETA_CREDITO');

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "TipoHabitacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precioBase" DECIMAL(10,2) NOT NULL,
    "capacidadMaxima" INTEGER NOT NULL,

    CONSTRAINT "TipoHabitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habitacion" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "piso" "Piso" NOT NULL,
    "tipoBaseId" INTEGER NOT NULL,
    "tipoActualId" INTEGER NOT NULL,
    "disponibilidad" "Disponibilidad" NOT NULL DEFAULT 'LIBRE',
    "estadoLimpieza" "EstadoLimpieza" NOT NULL DEFAULT 'LIMPIA',

    CONSTRAINT "Habitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "esEmpresa" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Huesped" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "nacionalidad" TEXT,

    CONSTRAINT "Huesped_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "fechaReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCheckIn" TIMESTAMP(3) NOT NULL,
    "fechaCheckOut" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "clienteId" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "totalReserva" DECIMAL(10,2) NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaHabitacion" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "habitacionId" INTEGER NOT NULL,
    "tipoVendidoId" INTEGER NOT NULL,
    "precioAplicado" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ReservaHabitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OcupacionHuesped" (
    "id" SERIAL NOT NULL,
    "reservaHabitacionId" INTEGER NOT NULL,
    "huespedId" INTEGER NOT NULL,

    CONSTRAINT "OcupacionHuesped_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo" "MetodoPago" NOT NULL,
    "esAdelanto" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CargoExtra" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CargoExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concepto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "Concepto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValorConcepto" (
    "id" SERIAL NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "conceptoId" INTEGER NOT NULL,

    CONSTRAINT "ValorConcepto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReciboSueldo" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalHaberes" DECIMAL(65,30) NOT NULL,
    "totalDescuentos" DECIMAL(65,30) NOT NULL,
    "netoACobrar" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ReciboSueldo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleRecibo" (
    "id" SERIAL NOT NULL,
    "reciboId" INTEGER NOT NULL,
    "concepto" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION,
    "base" DECIMAL(65,30),
    "haberes" DECIMAL(65,30),
    "descuentos" DECIMAL(65,30),

    CONSTRAINT "DetalleRecibo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoHabitacion_nombre_key" ON "TipoHabitacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Habitacion_numero_key" ON "Habitacion"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_documento_key" ON "Cliente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Huesped_documento_key" ON "Huesped"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "OcupacionHuesped_reservaHabitacionId_huespedId_key" ON "OcupacionHuesped"("reservaHabitacionId", "huespedId");

-- CreateIndex
CREATE UNIQUE INDEX "Concepto_codigo_key" ON "Concepto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ValorConcepto_empleadoId_conceptoId_key" ON "ValorConcepto"("empleadoId", "conceptoId");

-- AddForeignKey
ALTER TABLE "Habitacion" ADD CONSTRAINT "Habitacion_tipoBaseId_fkey" FOREIGN KEY ("tipoBaseId") REFERENCES "TipoHabitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habitacion" ADD CONSTRAINT "Habitacion_tipoActualId_fkey" FOREIGN KEY ("tipoActualId") REFERENCES "TipoHabitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaHabitacion" ADD CONSTRAINT "ReservaHabitacion_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaHabitacion" ADD CONSTRAINT "ReservaHabitacion_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "Habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaHabitacion" ADD CONSTRAINT "ReservaHabitacion_tipoVendidoId_fkey" FOREIGN KEY ("tipoVendidoId") REFERENCES "TipoHabitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcupacionHuesped" ADD CONSTRAINT "OcupacionHuesped_reservaHabitacionId_fkey" FOREIGN KEY ("reservaHabitacionId") REFERENCES "ReservaHabitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcupacionHuesped" ADD CONSTRAINT "OcupacionHuesped_huespedId_fkey" FOREIGN KEY ("huespedId") REFERENCES "Huesped"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoExtra" ADD CONSTRAINT "CargoExtra_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValorConcepto" ADD CONSTRAINT "ValorConcepto_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValorConcepto" ADD CONSTRAINT "ValorConcepto_conceptoId_fkey" FOREIGN KEY ("conceptoId") REFERENCES "Concepto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleRecibo" ADD CONSTRAINT "DetalleRecibo_reciboId_fkey" FOREIGN KEY ("reciboId") REFERENCES "ReciboSueldo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
