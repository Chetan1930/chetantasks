import { FolderOpen, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddCategory: () => void;
}

export function EmptyState({ onAddCategory }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 animate-fade-in">
      <div className="relative mb-5 sm:mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
          <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">No categories yet</h3>
      <p className="text-xs sm:text-base text-muted-foreground text-center max-w-xs sm:max-w-sm mb-6 sm:mb-8">
        Create your first category to start organizing your tasks and goals effectively.
      </p>
      
      <Button 
        onClick={onAddCategory} 
        size="lg" 
        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base touch-manipulation"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        Create your first category
      </Button>
    </div>
  );
}