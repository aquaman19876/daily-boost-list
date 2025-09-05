import React from 'react';
import { Task } from '@/hooks/useTasks';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, Repeat, BarChart3 } from 'lucide-react';

interface ProgressStatsProps {
  tasks: Task[];
  category: 'daily' | 'weekly' | 'monthly';
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ tasks, category }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const categoryIcons = {
    daily: Repeat,
    weekly: Calendar, 
    monthly: Target
  };

  const CategoryIcon = categoryIcons[category];

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="space-y-4">
        {/* Stats Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CategoryIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold capitalize text-foreground">
                {category}
              </h2>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">
              {completedTasks}<span className="text-lg text-muted-foreground">/{totalTasks}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {Math.round(completionRate)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="space-y-2">
            <Progress 
              value={completionRate} 
              className="h-2 bg-secondary"
            />
          </div>
        )}
      </div>
    </Card>
  );
};