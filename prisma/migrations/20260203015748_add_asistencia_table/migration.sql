-- CreateTable
CREATE TABLE "Asistencia" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "turno" TEXT NOT NULL,
    "registradoPor" INTEGER NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
