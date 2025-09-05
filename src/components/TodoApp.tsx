import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { ProgressStats } from './ProgressStats';
import { MotivationSection } from './MotivationSection';
import { Calendar, Target, Repeat } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

const TodoApp = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks();

  const getTasksByCategory = (category: 'daily' | 'weekly' | 'monthly') => {
    return tasks.filter(task => task.category === category);
  };

  const handleAddTask = (text: string) => {
    addTask(text, activeTab);
  };

  const tabConfig = {
    daily: { icon: Repeat, label: 'Daily', color: 'text-accent' },
    weekly: { icon: Calendar, label: 'Weekly', color: 'text-primary' },
    monthly: { icon: Target, label: 'Monthly', color: 'text-success' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Stats - Moved to top */}
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
                <TaskInput onAddTask={handleAddTask} />
                <TaskList 
                  tasks={getTasksByCategory(category as any)}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                />
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Motivation Section - Moved to bottom */}
        <MotivationSection tasks={getTasksByCategory(activeTab)} />
      </div>
    </div>
  );
};

export default TodoApp;