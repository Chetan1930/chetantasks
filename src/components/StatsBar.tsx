import { Task, Category } from '@/types/database';
import { CheckCircle2, Circle, ListTodo, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  tasks: Task[];
  categories: Category[];
  getSubtasks: (parentId: string) => Task[];
}

export function StatsBar({ tasks, categories, getSubtasks }: StatsBarProps) {
  // Calculate weighted task counts
  // If task has no subtasks: counts as 1
  // If task has subtasks: only count the subtasks, not the parent
  const calculateTaskStats = () => {
    const parentTasks = tasks.filter(t => !t.parent_task_id);
    let totalUnits = 0;
    let completedUnits = 0;

    parentTasks.forEach(parent => {
      const subtasks = getSubtasks(parent.id);
      
      if (subtasks.length === 0) {
        // No subtasks: parent counts as 1
        totalUnits += 1;
        if (parent.is_completed) completedUnits += 1;
      } else {
        // Has subtasks: only count subtasks
        totalUnits += subtasks.length;
        completedUnits += subtasks.filter(s => s.is_completed).length;
      }
    });

    return { totalUnits, completedUnits };
  };

  const { totalUnits, completedUnits } = calculateTaskStats();
  const pendingUnits = totalUnits - completedUnits;
  const completionRate = totalUnits > 0 
    ? Math.round((completedUnits / totalUnits) * 100) 
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalUnits,
      icon: ListTodo,
      color: 'hsl(var(--primary))',
      bgColor: 'hsl(var(--primary) / 0.1)',
    },
    {
      label: 'Completed',
      value: completedUnits,
      icon: CheckCircle2,
      color: 'hsl(142 71% 45%)',
      bgColor: 'hsl(142 71% 45% / 0.1)',
    },
    {
      label: 'Pending',
      value: pendingUnits,
      icon: Circle,
      color: 'hsl(25 95% 53%)',
      bgColor: 'hsl(25 95% 53% / 0.1)',
    },
    {
      label: 'Progress',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'hsl(280 85% 65%)',
      bgColor: 'hsl(280 85% 65% / 0.1)',
      showProgress: true,
      progress: completionRate,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-card rounded-2xl p-4 hover-lift animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              {stat.showProgress && (
                <div className="mt-3 progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
            </div>
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}