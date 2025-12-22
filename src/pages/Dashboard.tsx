import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { EmptyState } from '@/components/EmptyState';
import { StatsBar } from '@/components/StatsBar';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading, createCategory, deleteCategory } = useCategories();
  const { tasks, getSubtasks, loading: tasksLoading, createTask, toggleComplete, deleteTask } = useTasks();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || categoriesLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your tasks...</p>
        </div>
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Gradient background effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.12), transparent)'
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">My Tasks</h2>
            <p className="text-muted-foreground mt-1">
              Organize and track your personal goals
            </p>
          </div>
          <AddCategoryDialog
            onAdd={(name, color, icon) => createCategory(name, color, icon)}
          />
        </div>

        {categories.length > 0 && (
          <StatsBar tasks={tasks} categories={categories} getSubtasks={getSubtasks} />
        )}

        {categories.length === 0 ? (
          <EmptyState
            onAddCategory={() => {
              const dialog = document.querySelector('[data-radix-collection-item]');
              if (dialog) (dialog as HTMLButtonElement).click();
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                style={{ animationDelay: `${index * 80}ms` }}
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

      <Footer />
    </div>
  );
}