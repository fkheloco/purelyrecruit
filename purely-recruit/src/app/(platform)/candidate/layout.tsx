import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/shared/notification-bell";
import {
  LayoutDashboard,
  User,
  FileText,
  MessageSquare,
  Briefcase,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/candidate/profile", icon: User },
  { name: "Applications", href: "/candidate/applications", icon: FileText },
  { name: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { name: "Job Board", href: "/candidate/jobs", icon: Briefcase },
];

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-[#3CB3A2]"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-8">
          <div />
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
