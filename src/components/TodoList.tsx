import { todo } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { TodoItem } from "./TodoItem";

type Todo = InferSelectModel<typeof todo>;

type Props = {
  // 表示用のTodoの配列情報
  todos: Todo[];
  // 完了チェックボックスをチェックされたときの動作内容
  onToggle: (id: string) => void;
  // 削除アイコンをクリックされたときの動作内容
  onDelete: (id: string) => void;
};

export const TodoList = ({ todos, onToggle, onDelete }: Props) => {
  if (todos.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        タスクがありません
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
