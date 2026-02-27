import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { TextInputField } from "@/shared/components/form/TextInputField";
import { ROUTES } from "@/app/config/routes";
import logo from "@/assets/LogoNilo.png";

// 1. Esquema de validación (Requisito del repo)
const forgotPasswordSchema = z.object({
  email: z.string().email("Introduce un correo electrónico válido"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    // Aquí irá la lógica de Cognito más adelante
    console.log("Enviando instrucciones a:", data.email);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardContent className="pt-8 px-8 pb-10"><img
          src={logo}
          alt="Logo"
          className="h-32 mb-8 object-contain mx-auto"
        />
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Restablece tu contraseña
          </h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Ingresa el email asociado a tu cuenta y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-[42px] h-5 w-5 text-gray-400 z-10" />
                <div className="[&_input]:pl-10">
                  <TextInputField
                    name="email"
                    label="Email"
                    placeholder="Ingresa tu correo"
                    type="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-6"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Enviando..." : "CONTINUAR"}
              </Button>

              <div className="text-center">
                <Link
                  to={ROUTES.login}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}