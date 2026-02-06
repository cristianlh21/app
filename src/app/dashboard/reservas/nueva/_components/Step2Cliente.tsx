// dashboard/reservas/_components/Step2Cliente.tsx
import { ClienteForm } from "../../../clientes/_components/cliente-form";
import { ClienteFormValues } from "../../../clientes/_lib/schemas";
import { useReservaStore } from "../../useReservaStore";
import { Button } from "@/components/ui/button";

export function Step2Cliente() {
  const store = useReservaStore();

  const handleSiguiente = (values: ClienteFormValues) => {
    store.setCliente(values);
    store.setStep(3);
  };

  return (
    <ClienteForm 
      defaultValues={store.cliente || {}} 
      onSubmit={handleSiguiente}
    >
      <div className="flex justify-between mt-8 border-t pt-4">
        <Button type="button" variant="ghost" onClick={() => store.setStep(1)}>
          Volver
        </Button>
        <Button type="submit">Siguiente: Pagos</Button>
      </div>
    </ClienteForm>
  );
}