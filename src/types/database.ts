export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  category_id: string;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}
