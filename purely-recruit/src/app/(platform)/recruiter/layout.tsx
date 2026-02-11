import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/shared/notification-bell";
import { LayoutDashboard, Users, Briefcase, FileText, Building2, BarChart3, MessageSquare, Search } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Talent Pool", href: "/recruiter/talent-pool", icon: Users },
  { name: "Jobs", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Applications", href: "/recruiter/applications", icon: FileText },
  { name: "Clients", href: "/recruiter/clients", icon: Building2 },
  { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
];

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-white">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <span className="text-xl font-bold text-[#455E7F]">Purely</span>
          <span className="text-xl font-bold text-[#D7A839]">Recruit</span>
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
              placeholder="Search candidates, jobs..."
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
