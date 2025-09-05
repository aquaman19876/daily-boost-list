import React from 'react';
import { Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:bg-task-hover",
        "border border-border/50 bg-card/30",
        task.completed && "opacity-70"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
          task.completed
            ? "bg-success border-success text-success-foreground scale-110"
            : "border-muted-foreground/30 hover:border-primary hover:bg-primary-light"
        )}
      >
        {task.completed && <Check className="w-4 h-4" />}
      </button>

      {/* Task Text */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-base transition-all duration-200",
            task.completed
              ? "line-through text-task-completed"
              : "text-task-pending"
          )}
        >
          {task.text}
        </p>
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-8 w-8"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};