import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CheckSquare, LogOut, User, Linkedin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="gradient-text">Chetan's</span>{' '}
                <span className="text-foreground">TaskFlow</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com/in/chetan71"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline text-sm text-muted-foreground max-w-[150px] truncate">
                    {user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}