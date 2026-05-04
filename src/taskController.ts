import { Request, Response } from 'express';

export type Task = {
  id: number;
  title: string;
  done: boolean;
};

let tasks: Task[] = [];
let nextId = 1;

export function getTasks(_req: Request, res: Response) {
  res.json(tasks);
}

export function getTaskById(req: Request, res: Response) {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
}

export function createTask(req: Request, res: Response) {
  const { title } = req.body as { title?: string };
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const task: Task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
}

export function updateTask(req: Request, res: Response) {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const { title, done } = req.body as { title?: string; done?: boolean };
  if (title !== undefined) tasks[index].title = title.trim();
  if (done !== undefined) tasks[index].done = done;
  res.json(tasks[index]);
}

export function deleteTask(req: Request, res: Response) {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  tasks.splice(index, 1);
  res.status(204).send();
}

// Usado nos testes para resetar o estado em memória entre cada teste
export function resetTasks() {
  tasks = [];
  nextId = 1;
}
