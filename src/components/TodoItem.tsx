import { todo } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Todo = InferSelectModel<typeof todo>;

type Props = {
  // 表示用のTodoの情報
  todo: Todo;
  // 完了チェックボックスをチェックされたときの動作内容
  onToggle: (id: string) => void;
  // 削除アイコンをクリックされたときの動作内容
  onDelete: (id: string) => void;
};

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card transition-all",
        todo.is完了 && "opacity-60",
      )}
    >
      <Checkbox
        checked={todo.is完了}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`${todo.タスク}を${todo.is完了 ? "未完了" : "完了"}にする`}
      />
      <span
        className={cn(
          "flex-1 text-sm",
          todo.is完了 && "line-through text-muted-foreground",
        )}
      >
        {todo.タスク}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">削除</span>
      </Button>
    </div>
  );
};
