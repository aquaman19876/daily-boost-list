import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  category: 'daily' | 'weekly' | 'monthly';
  user_id?: string;
  updated_at?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from Supabase
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data || []).map(item => ({
        id: item.id,
        text: item.text,
        completed: item.completed,
        created_at: item.created_at,
        category: item.category as 'daily' | 'weekly' | 'monthly',
        user_id: item.user_id,
        updated_at: item.updated_at
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error loading tasks",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async (text: string, category: 'daily' | 'weekly' | 'monthly') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add tasks",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          text,
          category,
          user_id: user.id,
          completed: false
        }])
        .select()
        .single();

      if (error) throw error;
      const newTask = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        created_at: data.created_at,
        category: data.category as 'daily' | 'weekly' | 'monthly',
        user_id: data.user_id,
        updated_at: data.updated_at
      };
      setTasks(prev => [newTask, ...prev]);
      
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error adding task",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => 
        prev.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      toast({
        title: "Error updating task",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error deleting task",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Reset daily tasks
  const resetDailyTasks = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: false })
        .eq('category', 'daily');

      if (error) throw error;
      
      setTasks(prev => 
        prev.map(task => 
          task.category === 'daily' 
            ? { ...task, completed: false }
            : task
        )
      );
    } catch (error) {
      console.error('Error resetting daily tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Check for daily task reset
    const lastReset = localStorage.getItem('lastDailyReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      resetDailyTasks();
      localStorage.setItem('lastDailyReset', today);
    }
  }, []);

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks
  };
};