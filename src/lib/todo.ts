import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { type InferSelectModel } from "drizzle-orm";

export type Todo = InferSelectModel<typeof todo>;

export const getMyTodos = async (userId: string): Promise<Todo[]> => {
  const todos = await db
    .select()
    .from(todo)
    .where(eq(todo.userId, userId))
    .orderBy(asc(todo.is完了), asc(todo.createdAt));
  return todos;
};

export const addTodo = async (userId: string, タスク: string) => {
  await db.insert(todo).values({
    userId: userId,
    タスク: タスク,
  });
};

export const toggleTodo = async (userId: string, id: string) => {
  await db
    .update(todo)
    .set({ is完了: sql`NOT ${todo.is完了}` })
    .where(and(eq(todo.id, id), eq(todo.userId, userId)));
};

export const deleteTodo = async (userId: string, id: string) => {
  await db.delete(todo).where(and(eq(todo.id, id), eq(todo.userId, userId)));
};
