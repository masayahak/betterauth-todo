import { getMyTodos } from "@/lib/todo";
import { TodoApp } from "@/components/TodoApp";
import { requireSession } from "@/lib/auth-guard";
import { Logout } from "@/components/logout";
import { Footer } from "@/components/footer";

// AWSへデプロイした時にこのページがダイナミックレンダリングなことを明示する
export const dynamic = "force-dynamic";

export default async function Home() {
  // 認証ガード
  const session = await requireSession();
  const { id: userId, name: userName } = session.user;

  // ログイン者のTodoを表示
  const todos = await getMyTodos(userId);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              My Tasks
            </h2>
            <p className="text-sm text-slate-500">
              {userName} さんのワークスペース
            </p>
          </div>
          <div className="scale-90 origin-right">
            <Logout />
          </div>
        </div>

        <TodoApp todos={todos} />

        <Footer />
      </div>
    </main>
  );
}
