"use client";

import { ModeToggle } from "../themeToggle";

export default function CommonNavbar() {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between border-b shadow-sm bg-background text-foreground">
      <div className="text-primary">Welcome</div>
      <ModeToggle />
    </header>
  )
}