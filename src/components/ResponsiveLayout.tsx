import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ReactNode } from 'react';

interface ResponsiveLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  aside?: ReactNode;
}

export const ResponsiveLayout = ({ sidebar, main, aside }: ResponsiveLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:bg-muted/30 lg:overflow-y-auto">
        <div className="p-6">{sidebar}</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="p-6">{sidebar}</div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">Study Tools</h1>

          {aside && (
            <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="p-6">{aside}</div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6 h-full">
            {/* Tools Section */}
            <div className="lg:col-span-2 overflow-y-auto">{main}</div>

            {/* Desktop Aside */}
            {aside && <aside className="hidden lg:flex lg:flex-col lg:overflow-y-auto">{aside}</aside>}
          </div>
        </div>
      </main>
    </div>
  );
};

// Utility component for responsive sections
export const ResponsiveSection = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
};

// Utility component for responsive grid
export const ResponsiveGrid = ({
  children,
  cols = 1,
  className = '',
}: {
  children: ReactNode;
  cols?: number;
  className?: string;
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[cols] || 'grid-cols-1';

  return <div className={`grid ${colsClass} gap-4 ${className}`}>{children}</div>;
};
