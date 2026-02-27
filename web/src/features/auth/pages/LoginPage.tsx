import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { ROUTES } from "@/app/config/routes";
import { ROLES, type Role } from "@/app/config/roles";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { TextInputField } from "@/shared/components/form/TextInputField";
import logo from "@/assets/LogoNilo.png";

const loginSchema = z.object({
  email: z.string().email("Introduce un correo electrónico válido"),
  password: z.string().min(8, "La contraseña es incorrecta"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    ROUTES.dashboard;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const assignedRole = data.email.includes("admin")
      ? ROLES.ADMIN
      : ROLES.USER;

    try {
      await login(data.email, data.password, assignedRole as Role);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardContent className="pt-8 px-8 pb-10">
          <img
            src={logo}
            alt="Logo"
            className="h-32 mb-8 object-contain mx-auto"
          />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
            <p className="text-sm text-gray-500 mt-1">
              Inicia sesión para continuar
            </p>
          </div>

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


              <div className="relative mt-4">
                <Lock className="absolute left-3 top-[42px] h-5 w-5 text-gray-400 z-10" />
                <div className="[&_input]:pl-10 [&_input]:pr-10">
                  <TextInputField
                    name="password"
                    label="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    type={showPassword ? "text" : "password"}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="scale-x-[-1]" />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="flex justify-end -mt-1">
                <Link
                  to={ROUTES.forgotPassword}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >¿Has olvidado la contraseña?
                </Link>
              </div>


              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Ingresando..." : "INGRESAR"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;