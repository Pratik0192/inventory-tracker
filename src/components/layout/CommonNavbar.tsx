"use client";

import { ModeToggle } from "../themeToggle";

export default function CommonNavbar() {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between border-b shadow-sm bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100">
      <div className="text-lg font-semibold">Welcome</div>
      <ModeToggle />
    </header>
  )
}