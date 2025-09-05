import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTask(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-12 text-base"
        />
        <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
      </div>
      <Button 
        type="submit" 
        size="lg"
        disabled={!input.trim()}
        className="h-12 px-6 bg-primary hover:bg-primary-glow shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline ml-2">Add Task</span>
      </Button>
    </form>
  );
};