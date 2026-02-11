import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function JobsLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-[#455E7F]">
                Purely <span className="text-[#D7A839]">Recruit</span>
              </div>
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                href="/jobs"
                className="text-sm font-medium text-gray-700 hover:text-[#455E7F] transition"
              >
                Browse Jobs
              </Link>
              {userId ? (
                <>
                  <Link
                    href="/recruiter/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-[#455E7F] transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/sign-out"
                    className="text-sm font-medium text-[#455E7F] hover:text-[#3a5170] transition"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-gray-700 hover:text-[#455E7F] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded-lg bg-[#455E7F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a5170] transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-gray-500">
            <p>Built by Purely Works — Helping You Build Smarter with AI</p>
            <p className="mt-2 text-xs">© {new Date().getFullYear()} Purely Works. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
