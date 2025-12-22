import { FolderOpen, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddCategory: () => void;
}

export function EmptyState({ onAddCategory }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
          <FolderOpen className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-2">No categories yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-8">
        Create your first category to start organizing your tasks and goals effectively.
      </p>
      
      <Button 
        onClick={onAddCategory} 
        size="lg" 
        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
      >
        <Plus className="w-5 h-5" />
        Create your first category
      </Button>
    </div>
  );
}