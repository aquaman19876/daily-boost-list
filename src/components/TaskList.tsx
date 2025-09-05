import React from 'react';
import { Task } from '@/hooks/useTasks';
import { TaskItem } from './TaskItem';
import { Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
          <Plus className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground">No tasks yet</h3>
          <p className="text-muted-foreground text-sm">Add your first task to get started</p>
        </div>
      </div>
    );
  }

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </div>
  );
};