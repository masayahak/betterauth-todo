"use client";

import type React from "react";
import { useState } from "react";
import { todo } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  addTodoAction,
  toggleTodoAction,
  deleteTodoAction,
} from "@/app/(protected)/actions";
import { TodoList } from "./TodoList";
import { toast } from "sonner";

type Todo = InferSelectModel<typeof todo>;

type PropsType = {
  todos: Todo[];
};

export const TodoApp = ({ todos }: PropsType) => {
  const [newTodo, setNewTodo] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  // --- アクション ---
  const handleAdd = async () => {
    const title = newTodo.trim();
    if (title === "") return;
    try {
      await addTodoAction(title);
      toast.success("タスクを追加しました");
      setNewTodo("");
    } catch {
      toast.error("追加に失敗しました☠");
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") await handleAdd();
  };

  const handleToggle = async (id: string) => {
    try {
      const targetTodo = todos.find((t) => t.id === id);
      await toggleTodoAction(id);
      if (targetTodo && !targetTodo.is完了) {
        toast.success("タスクを完了しました！🎉");
      } else {
        toast.info("タスクを未完了に戻しました");
      }
    } catch {
      toast.error("更新に失敗しました☠");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const targetTodo = todos.find((t) => t.id === id);
      await deleteTodoAction(id);
      toast("タスクを削除しました", {
        description: targetTodo ? `「${targetTodo.タスク}」` : undefined,
        action: {
          label: "閉じる",
          onClick: () => {}, // Undo機能などをつける場合はここに実装
        },
      });
    } catch {
      toast.error("削除に失敗しました☠");
    }
  };

  // 「完了したタスクも表示」をチェック／チェックオフ
  const filteredTodos = showCompleted
    ? todos
    : todos.filter((todo) => !todo.is完了);

  const completedCount = todos.filter((todo) => todo.is完了).length;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <p className="text-sm text-muted-foreground text-center">
          {completedCount} / {todos.length} 完了
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 入力エリア */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="新しいタスクを入力..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">タスクを追加</span>
          </Button>
        </div>

        {/* フィルター操作 */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="showCompleted"
            checked={showCompleted}
            onCheckedChange={(checked) => setShowCompleted(checked === true)}
          />
          <label
            htmlFor="showCompleted"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            完了したタスクも表示
          </label>
        </div>

        {/* ★ リスト表示 */}
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
