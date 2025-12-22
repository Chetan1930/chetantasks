import { useState } from 'react';
import { Category, Task } from '@/types/database';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  MoreHorizontal,
  Heart,
  Code,
  Brain,
  Dumbbell,
  Wallet,
  Folder,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  code: Code,
  brain: Brain,
  dumbbell: Dumbbell,
  wallet: Wallet,
  folder: Folder,
};

interface CategoryCardProps {
  category: Category;
  tasks: Task[];
  getSubtasks: (parentId: string) => Task[];
  onCreateTask: (title: string, categoryId: string, parentId?: string) => void;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function CategoryCard({
  category,
  tasks,
  getSubtasks,
  onCreateTask,
  onToggleComplete,
  onDeleteTask,
  onDeleteCategory,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [addingSubtaskFor, setAddingSubtaskFor] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const Icon = iconMap[category.icon] || Folder;
  const parentTasks = tasks.filter(t => !t.parent_task_id);
  const completedCount = tasks.filter(t => t.is_completed).length;
  const totalCount = tasks.length;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onCreateTask(newTaskTitle.trim(), category.id);
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  const handleAddSubtask = (parentId: string) => {
    if (newSubtaskTitle.trim()) {
      onCreateTask(newSubtaskTitle.trim(), category.id, parentId);
      setNewSubtaskTitle('');
      setAddingSubtaskFor(null);
    }
  };

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  return (
    <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden animate-slide-up">
      <CardHeader
        className="p-4 cursor-pointer"
        style={{ borderLeft: `4px solid ${category.color}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {completedCount}/{totalCount} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0 space-y-2">
          {parentTasks.map((task) => {
            const subtasks = getSubtasks(task.id);
            const isTaskExpanded = expandedTasks.has(task.id);
            const hasSubtasks = subtasks.length > 0;

            return (
              <div key={task.id} className="space-y-1">
                <div
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                    'hover:bg-secondary/50 group',
                    task.is_completed && 'opacity-60'
                  )}
                >
                  {hasSubtasks ? (
                    <button
                      onClick={() => toggleTaskExpand(task.id)}
                      className="p-0.5 hover:bg-secondary rounded"
                    >
                      {isTaskExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  ) : (
                    <div className="w-5" />
                  )}
                  <Checkbox
                    checked={task.is_completed}
                    onCheckedChange={(checked) =>
                      onToggleComplete(task.id, checked as boolean)
                    }
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span
                    className={cn(
                      'flex-1 text-sm',
                      task.is_completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {task.title}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setAddingSubtaskFor(task.id)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Subtasks */}
                {isTaskExpanded && subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={cn(
                      'flex items-center gap-3 p-2 pl-12 rounded-lg transition-all duration-200',
                      'hover:bg-secondary/30 group',
                      subtask.is_completed && 'opacity-60'
                    )}
                  >
                    <Checkbox
                      checked={subtask.is_completed}
                      onCheckedChange={(checked) =>
                        onToggleComplete(subtask.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={cn(
                        'flex-1 text-sm',
                        subtask.is_completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {subtask.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                      onClick={() => onDeleteTask(subtask.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}

                {/* Add subtask input */}
                {addingSubtaskFor === task.id && (
                  <div className="flex items-center gap-2 pl-12 pr-2">
                    <Input
                      placeholder="Add subtask..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddSubtask(task.id);
                        if (e.key === 'Escape') setAddingSubtaskFor(null);
                      }}
                      className="h-9 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddSubtask(task.id)}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add new task */}
          {showAddTask ? (
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                  if (e.key === 'Escape') setShowAddTask(false);
                }}
                className="h-9"
                autoFocus
              />
              <Button size="sm" onClick={handleAddTask}>
                Add
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => setShowAddTask(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add task
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
