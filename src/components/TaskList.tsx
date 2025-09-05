import React from 'react';
import { Task } from './TodoApp';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-24 h-24 mx-auto bg-primary-light rounded-full flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Ready to be productive?</h3>
          <p className="text-muted-foreground">Add your first task above to get started</p>
        </div>
      </div>
    );
  }

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt.getTime() - a.createdAt.getTime();
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