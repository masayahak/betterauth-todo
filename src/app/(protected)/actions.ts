"use server";
import { addTodo, deleteTodo, toggleTodo } from "@/lib/todo";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ユーザーIDをPropsとして受け取ると、クライアントから改ざんされた
// ユーザーIDが渡される可能性があるため、必ずサーバー側でセッションから
// 取得するようにしています。

const getUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("認証切れ、またはログインしていません");
  }
  return session.user.id;
};

export const addTodoAction = async (title: string) => {
  // DB操作
  const userId = await getUserId();
  await addTodo(userId, title);

  // UI操作（ルートページのキャッシュを破棄し、最新のTodo一覧を表示させる）
  revalidatePath("/");
};

export const toggleTodoAction = async (id: string) => {
  // DB操作
  const userId = await getUserId();
  await toggleTodo(userId, id);

  // UI操作（ルートページのキャッシュを破棄し、最新のTodo一覧を表示させる）
  revalidatePath("/");
};

export const deleteTodoAction = async (id: string) => {
  // DB操作
  const userId = await getUserId();
  await deleteTodo(userId, id);

  // UI操作（ルートページのキャッシュを破棄し、最新のTodo一覧を表示させる）
  revalidatePath("/");
};
