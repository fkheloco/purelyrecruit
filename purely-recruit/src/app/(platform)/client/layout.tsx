import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/shared/notification-bell";
import { LayoutDashboard, Briefcase, Users, Settings, MessageSquare, BarChart3, Search } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Jobs", href: "/client/jobs", icon: Briefcase },
  { name: "Candidates", href: "/client/candidates", icon: Users },
  { name: "Scoring Config", href: "/client/scoring-config", icon: Settings },
  { name: "Messages", href: "/client/messages", icon: MessageSquare },
  { name: "Reports", href: "/client/reports", icon: BarChart3 },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-white">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <span className="text-xl font-bold text-[#455E7F]">Purely</span>
          <span className="text-xl font-bold text-[#3CB3A2]">Recruit</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-[#455E7F]"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-8">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, candidates..."
              className="border-0 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-0 w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
