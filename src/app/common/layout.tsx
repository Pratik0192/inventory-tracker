import CommonNavbar from "@/components/layout/CommonNavbar";
import CommonSIdebar from "@/components/layout/CommonSidebar";

export default function commonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background text-foreground">
      <CommonSIdebar />
      <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
        <CommonNavbar />
        <main className="flex-1 p-6 min-h-screen bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}