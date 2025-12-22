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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
          <DialogDescription>
            Organize your tasks into categories for better management.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category name</Label>
            <Input
              id="name"
              placeholder="e.g., Development, Health, Finance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <Label>Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(({ name: iconName, Icon }) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={cn(
                    'p-3 rounded-lg transition-all duration-200 border-2',
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
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    'w-10 h-10 rounded-full transition-all duration-200',
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
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
