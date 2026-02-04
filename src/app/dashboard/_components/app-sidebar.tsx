"use client";

import {
  BedDouble,
  ClipboardCheck,
  Home,
  LogOut,
  LucideIcon,
  Settings,
  Users,
  ConciergeBell,
  CalendarDays, // Cambié Home por este para el Planning
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Ajusté la ruta
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SessionPayload } from "../typesSession";
import { logoutAction } from "@/app/_actionsAuth"; // Ajustado a tu archivo real

type Rol = "ADMIN" | "RECEPCIONISTA" | "MUCAMA";

interface SidebarProps {
  session: SessionPayload | null;
}

type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  rolesPermitidos: Rol[];
};

const items: MenuItem[] = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: Home,
    rolesPermitidos: ["ADMIN", "MUCAMA", "RECEPCIONISTA"],
  },
  {
    title: "Planning",
    url: "/dashboard/planning",
    icon: CalendarDays, // Ícono más apropiado para un calendario de hotel
    rolesPermitidos: ["ADMIN", "MUCAMA", "RECEPCIONISTA"],
  },
  {
    title: "Reservas",
    url: "/dashboard/reservas",
    icon: ConciergeBell,
    rolesPermitidos: ["ADMIN", "RECEPCIONISTA"],
  },
  {
    title: "Horarios",
    url: "/dashboard/horarios",
    icon: CalendarDays, // Ícono más apropiado para un calendario de hotel
    rolesPermitidos: ["ADMIN", "RECEPCIONISTA"],
  },
  {
    title: "Clientes",
    url: "/dashboard/clientes",
    icon: Users,
    rolesPermitidos: ["ADMIN", "RECEPCIONISTA"],
  },
  {
    title: "Habitaciones",
    url: "/dashboard/habitaciones",
    icon: BedDouble,
    rolesPermitidos: ["ADMIN", "RECEPCIONISTA"],
  },
  {
    title: "Limpieza",
    url: "/dashboard/limpieza",
    icon: ClipboardCheck,
    rolesPermitidos: ["ADMIN", "MUCAMA", "RECEPCIONISTA"],
  },
  {
    title: "Empleados",
    url: "/dashboard/empleados",
    icon: Users,
    rolesPermitidos: ["ADMIN"], 
  },
  {
    title: "Ajustes",
    url: "/dashboard/settings",
    icon: Settings,
    rolesPermitidos: ["ADMIN"],
  },
];

export function AppSidebar({ session }: SidebarProps) {
  const userRol = session?.rol || "RECEPCIONISTA"; // Fallback por seguridad
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Home size={18} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">SHAUARD</span>
              <span className="text-[10px] text-muted-foreground uppercase">Hotel System</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (!item.rolesPermitidos.includes(userRol as Rol)) {
                  return null;
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={async () => {
              await logoutAction();
            }}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}