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
  Pencil,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { EditCategoryDialog } from './EditCategoryDialog';
import { EditTaskDialog } from './EditTaskDialog';

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
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function CategoryCard({
  category,
  tasks,
  getSubtasks,
  onCreateTask,
  onToggleComplete,
  onDeleteTask,
  onDeleteCategory,
  onUpdateCategory,
  onUpdateTask,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [addingSubtaskFor, setAddingSubtaskFor] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  // Edit dialog states
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Task | null>(null);

  const Icon = iconMap[category.icon] || Folder;
  const parentTasks = tasks.filter(t => !t.parent_task_id);

  // Calculate progress based on weighted counting
  const calculateProgress = () => {
    let totalUnits = 0;
    let completedUnits = 0;

    parentTasks.forEach(parent => {
      const subtasks = getSubtasks(parent.id);
      
      if (subtasks.length === 0) {
        totalUnits += 1;
        if (parent.is_completed) completedUnits += 1;
      } else {
        totalUnits += subtasks.length;
        completedUnits += subtasks.filter(s => s.is_completed).length;
      }
    });

    return { totalUnits, completedUnits };
  };

  const { totalUnits, completedUnits } = calculateProgress();
  const progress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

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
    <>
      <Card className="glass-card overflow-hidden hover-lift animate-slide-up border-0">
        <CardHeader
          className="p-3 sm:p-4 cursor-pointer relative"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Color accent bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: category.color }}
          />
          
          <div className="flex items-center justify-between pl-2 sm:pl-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div
                className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm shrink-0"
                style={{ 
                  backgroundColor: `${category.color}15`,
                  boxShadow: `0 2px 8px ${category.color}20`
                }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: category.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{category.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-16 sm:w-20 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: category.color 
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {completedUnits}/{totalUnits}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 sm:h-8 sm:w-8 rounded-lg hover:bg-secondary/80 active:scale-95 transition-all touch-manipulation"
                  >
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="min-w-[160px] sm:min-w-[180px] bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl p-1.5 z-50"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditCategoryOpen(true);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-lg hover:bg-secondary/80 focus:bg-secondary/80 cursor-pointer transition-colors touch-manipulation"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="font-medium text-sm">Edit Category</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category.id);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-lg text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors touch-manipulation"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium text-sm">Delete Category</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="p-1.5 sm:p-1">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="p-3 sm:p-4 pt-0 space-y-1">
            {parentTasks.length === 0 && !showAddTask && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                No tasks yet. Add your first task!
              </p>
            )}

            {parentTasks.map((task) => {
              const subtasks = getSubtasks(task.id);
              const isTaskExpanded = expandedTasks.has(task.id);
              const hasSubtasks = subtasks.length > 0;
              const subtaskProgress = hasSubtasks 
                ? `${subtasks.filter(s => s.is_completed).length}/${subtasks.length}`
                : null;

              return (
                <div key={task.id} className="space-y-0.5">
                  <div
                    className={cn(
                      'flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200',
                      'hover:bg-secondary/60 group active:bg-secondary/80',
                      task.is_completed && 'opacity-50'
                    )}
                  >
                    {hasSubtasks ? (
                      <button
                        onClick={() => toggleTaskExpand(task.id)}
                        className="p-1 hover:bg-secondary rounded transition-colors touch-manipulation"
                      >
                        {isTaskExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    ) : (
                      <div className="w-6" />
                    )}
                    <Checkbox
                      checked={task.is_completed}
                      onCheckedChange={(checked) =>
                        onToggleComplete(task.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5"
                    />
                    <span
                      className={cn(
                        'flex-1 text-xs sm:text-sm font-medium min-w-0 break-words',
                        task.is_completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </span>
                    {subtaskProgress && (
                      <span className="text-xs text-muted-foreground bg-secondary px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                        {subtaskProgress}
                      </span>
                    )}
                    <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                        onClick={() => setEditingTask(task)}
                        title="Edit task"
                      >
                        <Pencil className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                        onClick={() => setAddingSubtaskFor(task.id)}
                        title="Add subtask"
                      >
                        <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 text-destructive hover:text-destructive hover:bg-destructive/10 touch-manipulation"
                        onClick={() => onDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  {isTaskExpanded && subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className={cn(
                        'flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 pl-10 sm:pl-14 rounded-xl transition-all duration-200',
                        'hover:bg-secondary/40 group active:bg-secondary/60',
                        subtask.is_completed && 'opacity-50'
                      )}
                    >
                      <Checkbox
                        checked={subtask.is_completed}
                        onCheckedChange={(checked) =>
                          onToggleComplete(subtask.id, checked as boolean)
                        }
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5"
                      />
                      <span
                        className={cn(
                          'flex-1 text-xs sm:text-sm min-w-0 break-words',
                          subtask.is_completed && 'line-through text-muted-foreground'
                        )}
                      >
                        {subtask.title}
                      </span>
                      <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                          onClick={() => setEditingSubtask(subtask)}
                          title="Edit subtask"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-7 sm:w-7 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity touch-manipulation"
                          onClick={() => onDeleteTask(subtask.id)}
                          title="Delete subtask"
                        >
                          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add subtask input */}
                  {addingSubtaskFor === task.id && (
                    <div className="flex items-center gap-2 pl-10 sm:pl-14 pr-2 py-1">
                      <Input
                        placeholder="Add subtask..."
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddSubtask(task.id);
                          if (e.key === 'Escape') setAddingSubtaskFor(null);
                        }}
                        className="h-9 text-sm bg-secondary/50 border-0"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddSubtask(task.id)}
                        className="shrink-0"
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
                  className="h-10 bg-secondary/50 border-0"
                  autoFocus
                />
                <Button onClick={handleAddTask} className="shrink-0">
                  Add
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/60 mt-2 h-10 touch-manipulation"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add task
              </Button>
            )}
          </CardContent>
        )}
      </Card>

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        category={category}
        open={editCategoryOpen}
        onOpenChange={setEditCategoryOpen}
        onUpdate={onUpdateCategory}
      />

      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onUpdate={onUpdateTask}
          isSubtask={false}
        />
      )}

      {/* Edit Subtask Dialog */}
      {editingSubtask && (
        <EditTaskDialog
          task={editingSubtask}
          open={!!editingSubtask}
          onOpenChange={(open) => !open && setEditingSubtask(null)}
          onUpdate={onUpdateTask}
          isSubtask={true}
        />
      )}
    </>
  );
}
