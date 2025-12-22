import { Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddCategory: () => void;
}

export function EmptyState({ onAddCategory }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="p-4 rounded-2xl bg-primary/10 mb-6">
        <Folder className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        No categories yet
      </h2>
      <p className="text-muted-foreground text-center max-w-sm mb-8">
        Create your first category to start organizing your tasks. Try categories
        like "Development", "Relationship", or "Health".
      </p>
      <Button size="lg" onClick={onAddCategory} className="gap-2">
        <Plus className="w-5 h-5" />
        Create your first category
      </Button>
    </div>
  );
}
