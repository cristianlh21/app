"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner" // Importamos Sonner
import { loginAction } from "./_actionsAuth" // Importamos tu acción
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react" // Para el ícono de carga

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "El PIN debe tener 4 dígitos.",
  }),
})

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // startTransition avisa a Next.js que estamos haciendo algo en el servidor
    startTransition(async () => {
      const result = await loginAction(data.pin)

      if (result?.error) {
        // Si hay error, mostramos el toast rojo
        toast.error(result.error)
        form.reset() // Limpiamos el PIN
      } else {
        // Si sale bien, mostramos éxito antes de redirigir
        toast.success("¡Bienvenido al sistema!")
      }
    })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
      <Card className="w-95 border-slate-800 bg-slate-900 text-slate-50 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black tracking-tighter text-white">
            HOTEL SHAUARD
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ingrese su PIN de acceso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-slate-300">PIN de Seguridad</FormLabel>
                    <FormControl>
                      <InputOTP 
                        maxLength={4} 
                        disabled={isPending} 
                        {...field}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="h-14 w-12 border-slate-700 bg-slate-950 text-2xl" />
                          <InputOTPSlot index={1} className="h-14 w-12 border-slate-700 bg-slate-950 text-2xl" />
                          <InputOTPSlot index={2} className="h-14 w-12 border-slate-700 bg-slate-950 text-2xl" />
                          <InputOTPSlot index={3} className="h-14 w-12 border-slate-700 bg-slate-950 text-2xl" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    VERIFICANDO...
                  </>
                ) : (
                  "ENTRAR"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}