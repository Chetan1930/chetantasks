import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Heart, Code, Brain, Dumbbell, Wallet, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = [
  { name: 'Rose', value: '#ec4899' },
  { name: 'Blue', value: '#0ea5e9' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Indigo', value: '#6366f1' },
];

const ICONS = [
  { name: 'heart', Icon: Heart },
  { name: 'code', Icon: Code },
  { name: 'brain', Icon: Brain },
  { name: 'dumbbell', Icon: Dumbbell },
  { name: 'wallet', Icon: Wallet },
  { name: 'folder', Icon: Folder },
];

interface AddCategoryDialogProps {
  onAdd: (name: string, color: string, icon: string) => void;
}

export function AddCategoryDialog({ onAdd }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState('folder');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedColor, selectedIcon);
      setName('');
      setSelectedColor(COLORS[0].value);
      setSelectedIcon('folder');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Add</span> Category
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create new category</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Organize your tasks into categories for better management.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Category name</Label>
            <Input
              id="name"
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-11">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}