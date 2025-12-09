import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="pt-16 w-full">
        {children}
      </main>
    </div>
  );
}
