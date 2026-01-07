import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Category } from '@/types/database';
import {
  Heart,
  Code,
  Brain,
  Dumbbell,
  Wallet,
  Folder,
} from 'lucide-react';

const COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
];

const ICONS = [
  { name: 'folder', Icon: Folder },
  { name: 'heart', Icon: Heart },
  { name: 'code', Icon: Code },
  { name: 'brain', Icon: Brain },
  { name: 'dumbbell', Icon: Dumbbell },
  { name: 'wallet', Icon: Wallet },
];

interface EditCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange, onUpdate }: EditCategoryDialogProps) {
  const [name, setName] = useState(category.name);
  const [selectedColor, setSelectedColor] = useState(category.color);
  const [selectedIcon, setSelectedIcon] = useState(category.icon);

  useEffect(() => {
    if (open) {
      setName(category.name);
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
    }
  }, [open, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdate(category.id, {
        name: name.trim(),
        color: selectedColor,
        icon: selectedIcon,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit category</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Update your category details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm">Category name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Development, Health, Finance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm">Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(({ name: iconName, Icon }) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={cn(
                    'p-2.5 sm:p-3 rounded-lg transition-all duration-200 border-2 touch-manipulation',
                    selectedIcon === iconName
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: selectedIcon === iconName ? selectedColor : undefined,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    'w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 touch-manipulation',
                    'ring-offset-2 ring-offset-background',
                    selectedColor === color.value && 'ring-2 ring-primary'
                  )}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-11">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
