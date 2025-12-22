import { Linkedin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" /> by Chetan
          </p>
          
          <a
            href="https://linkedin.com/in/chetan71"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}