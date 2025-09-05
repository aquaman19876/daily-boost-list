import React from 'react';
import { Task } from './TodoApp';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Zap } from 'lucide-react';

interface ProgressStatsProps {
  tasks: Task[];
  category: 'daily' | 'weekly' | 'monthly';
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ tasks, category }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getMotivationalMessage = () => {
    if (totalTasks === 0) {
      return { text: "Ready to start your journey? 🚀", icon: Target };
    }
    
    if (completionRate === 100) {
      const messages = [
        "Incredible! You've crushed everything! 🎉",
        "Absolutely amazing! Perfect score! ⭐",
        "Outstanding work! You're unstoppable! 🔥"
      ];
      return { text: messages[Math.floor(Math.random() * messages.length)], icon: TrendingUp };
    }
    
    if (completionRate >= 80) {
      return { text: `So close! Just ${totalTasks - completedTasks} more to go! 💪`, icon: Zap };
    }
    
    if (completionRate >= 50) {
      return { text: `Great progress! You're halfway there! 📈`, icon: TrendingUp };
    }
    
    if (completionRate > 0) {
      return { text: `Nice start! Keep the momentum going! ⚡`, icon: Zap };
    }
    
    return { text: `Time to make things happen! 💫`, icon: Target };
  };

  const motivation = getMotivationalMessage();
  const Icon = motivation.icon;

  const categoryEmojis = {
    daily: '☀️',
    weekly: '📅', 
    monthly: '🎯'
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-primary-light/20 to-accent-light/20 border-border/30 shadow-sm">
      <div className="space-y-4">
        {/* Stats Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryEmojis[category]}</span>
            <h2 className="text-lg font-semibold capitalize text-foreground">
              {category} Progress
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {completedTasks}/{totalTasks}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(completionRate)}% complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="space-y-2">
            <Progress 
              value={completionRate} 
              className="h-3 bg-progress-bg"
            />
          </div>
        )}

        {/* Motivational Message */}
        <div className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-foreground font-medium">{motivation.text}</span>
        </div>
      </div>
    </Card>
  );
};