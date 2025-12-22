import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/database';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useTasks(categoryId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (
    title: string,
    category_id: string,
    parent_task_id?: string,
    description?: string
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title,
          category_id,
          parent_task_id: parent_task_id || null,
          description: description || null,
        })
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [...prev, data]);
      toast.success('Task created');
      return data;
    } catch (error: any) {
      toast.error('Failed to create task');
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
    } catch (error: any) {
      toast.error('Failed to update task');
    }
  };

  const toggleComplete = async (id: string, is_completed: boolean) => {
    await updateTask(id, { is_completed });
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id && task.parent_task_id !== id));
      toast.success('Task deleted');
    } catch (error: any) {
      toast.error('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, categoryId]);

  // Get parent tasks (no parent_task_id)
  const parentTasks = tasks.filter(t => !t.parent_task_id);
  
  // Get subtasks for a parent
  const getSubtasks = (parentId: string) => tasks.filter(t => t.parent_task_id === parentId);

  return {
    tasks,
    parentTasks,
    getSubtasks,
    loading,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    refetch: fetchTasks,
  };
}
