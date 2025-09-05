import React from 'react';
import { Task } from '@/hooks/useTasks';
import { TrendingUp, Target, Zap, Star } from 'lucide-react';

interface MotivationSectionProps {
  tasks: Task[];
}

export const MotivationSection: React.FC<MotivationSectionProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getMotivation = () => {
    if (totalTasks === 0) {
      return { text: "Ready to tackle your goals?", icon: Target };
    }
    
    if (completionRate === 100) {
      const messages = [
        "Perfect! You've completed everything",
        "Outstanding work! All tasks done",
        "Excellent! You're on fire today"
      ];
      return { text: messages[Math.floor(Math.random() * messages.length)], icon: Star };
    }
    
    if (completionRate >= 80) {
      return { text: `Almost there! ${totalTasks - completedTasks} more to go`, icon: Zap };
    }
    
    if (completionRate >= 50) {
      return { text: "Great progress! Keep it up", icon: TrendingUp };
    }
    
    if (completionRate > 0) {
      return { text: "Good start! Stay focused", icon: Zap };
    }
    
    return { text: "Time to get started", icon: Target };
  };

  const motivation = getMotivation();
  const Icon = motivation.icon;

  return (
    <div className="text-center py-4">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{motivation.text}</span>
      </div>
    </div>
  );
};