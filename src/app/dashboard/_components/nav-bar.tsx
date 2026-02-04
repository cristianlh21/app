"use client";

import { LogOut, Moon, Sun, User, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionPayload } from "../typesSession";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/app/_actionsAuth";
import { useSyncExternalStore } from "react";

interface NavBarProps {
  session: SessionPayload | null;
}

// 2. Esta función nos dirá si estamos en el cliente de forma segura
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const NavBar = ({ session }: NavBarProps) => {
  const { setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // 3. Este hook reemplaza al useEffect + useState para la hidratación
  // Es la forma moderna de saber si estamos en el cliente sin causar renders extra
  const isMounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!isMounted) {
    return (
      <nav className="p-4 flex items-center justify-between border-b bg-background/95 h-16.25">
         <div className="w-8 h-8 bg-slate-100 animate-pulse rounded" />
         <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-full" />
      </nav>
    );
  }

  return (
    <nav className="p-4 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* LEFT SIDE: Control del Sidebar */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden md:block">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
            {session?.rol || "Invitado"}
          </Badge>
        </div>
      </div>

      {/* RIGHT SIDE: Acciones y Usuario */}
      <div className="flex items-center gap-3">
        
        {/* THEME TOGGLE */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* USER PROFILE */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-9 w-9 border transition-hover hover:opacity-80">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {session ? getInitials(session.nombre) : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={10}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.nombre}</p>
                <p className="text-xs leading-none text-muted-foreground uppercase">
                  {session?.rol}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Recibo de Sueldo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              // ✅ CORRECCIÓN 3: Llamamos a la Server Action
              onClick={async () => {
                await logoutAction();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;