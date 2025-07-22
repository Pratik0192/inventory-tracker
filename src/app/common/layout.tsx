import CommonNavbar from "@/components/layout/CommonNavbar";
import CommonSIdebar from "@/components/layout/CommonSidebar";

export default function commonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <CommonSIdebar />
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <CommonNavbar />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}