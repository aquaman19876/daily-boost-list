import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { ProgressStats } from './ProgressStats';
import { Calendar, Target, Repeat } from 'lucide-react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category: 'daily' | 'weekly' | 'monthly';
}

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      })));
    }

    // Reset daily tasks at midnight
    const now = new Date();
    const lastReset = localStorage.getItem('lastDailyReset');
    const today = now.toDateString();
    
    if (lastReset !== today) {
      setTasks(prev => prev.map(task => 
        task.category === 'daily' 
          ? { ...task, completed: false }
          : task
      ));
      localStorage.setItem('lastDailyReset', today);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      category: activeTab
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTasksByCategory = (category: 'daily' | 'weekly' | 'monthly') => {
    return tasks.filter(task => task.category === category);
  };

  const tabConfig = {
    daily: { icon: Repeat, label: 'Daily', color: 'text-accent' },
    weekly: { icon: Calendar, label: 'Weekly', color: 'text-primary' },
    monthly: { icon: Target, label: 'Monthly', color: 'text-success' }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-muted-foreground">Stay focused, get things done</p>
        </div>

        {/* Progress Stats */}
        <ProgressStats tasks={getTasksByCategory(activeTab)} category={activeTab} />

        {/* Main Todo Interface */}
        <Card className="p-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50">
              {Object.entries(tabConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">{config.label.slice(0, 1)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.keys(tabConfig).map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <TaskInput onAddTask={addTask} category={category as any} />
                <TaskList 
                  tasks={getTasksByCategory(category as any)}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                />
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default TodoApp;