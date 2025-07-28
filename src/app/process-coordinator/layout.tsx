import ProcessCoordinatorNavbar from "@/components/layout/ProcessNavbar";
import ProcessCoordinatorSidebar from "@/components/layout/ProcessSidebar";


export default function commonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background text-foreground">
      <ProcessCoordinatorSidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
        <ProcessCoordinatorNavbar />
        <main className="flex-1 p-6 min-h-screen bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}