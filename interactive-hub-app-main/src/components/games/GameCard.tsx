import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colorClass: string;
  delay?: number;
}

export function GameCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  colorClass,
  delay = 0 
}: GameCardProps) {
  return (
    <Link 
      to={href}
      className="block opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <Card 
        variant="game" 
        className={cn(
          "group h-full overflow-hidden",
          "hover:scale-[1.02] transition-all duration-300"
        )}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div 
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
              "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              colorClass
            )}
          >
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm flex-grow">
            {description}
          </p>
          
          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Play Now
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
