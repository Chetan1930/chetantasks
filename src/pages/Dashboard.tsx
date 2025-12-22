import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { EmptyState } from '@/components/EmptyState';
import { StatsBar } from '@/components/StatsBar';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading, createCategory, deleteCategory } = useCategories();
  const { tasks, getSubtasks, loading: tasksLoading, createTask, toggleComplete, deleteTask } = useTasks();
  const addCategoryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || categoriesLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateTask = (title: string, categoryId: string, parentId?: string) => {
    createTask(title, categoryId, parentId);
  };

  const getCategoryTasks = (categoryId: string) => {
    return tasks.filter(t => t.category_id === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Tasks</h2>
            <p className="text-muted-foreground mt-1">
              Organize and track your personal goals
            </p>
          </div>
          <AddCategoryDialog
            onAdd={(name, color, icon) => createCategory(name, color, icon)}
          />
        </div>

        {categories.length > 0 && (
          <StatsBar tasks={tasks} categories={categories} />
        )}

        {categories.length === 0 ? (
          <EmptyState
            onAddCategory={() => {
              // Trigger the dialog
              const dialog = document.querySelector('[data-radix-collection-item]');
              if (dialog) (dialog as HTMLButtonElement).click();
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryCard
                  category={category}
                  tasks={getCategoryTasks(category.id)}
                  getSubtasks={getSubtasks}
                  onCreateTask={handleCreateTask}
                  onToggleComplete={toggleComplete}
                  onDeleteTask={deleteTask}
                  onDeleteCategory={deleteCategory}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
