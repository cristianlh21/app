// app/dashboard/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import NavBar from "./_components/nav-bar"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { SessionPayload } from "./typesSession"

const SECRET_KEY = new TextEncoder().encode("clave-secreta-del-hotel-123")

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  let session: SessionPayload | null = null

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY)
      session = payload as unknown as SessionPayload
    } catch (e) { console.error(e) }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar session={session} />
        <div className="flex flex-col flex-1">
          {/* Aquí vive el NavBar ahora */}
          <NavBar session={session} />
          
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}