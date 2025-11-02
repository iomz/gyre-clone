"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchTopicsAction } from "@/app/actions";

type HandleTopicSelect = (topic: string) => void;

export default function TopicSelector({
  topic,
  onChangeAction,
}: {
  topic: string;
  onChangeAction: HandleTopicSelect;
}) {
  const [topics, setTopics] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const newTopics = await fetchTopicsAction();
      setTopics(newTopics);
    });
  }, []);

  return (
    <Select
      disabled={isPending}
      value={topic}
      onValueChange={(v) => onChangeAction(v)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Topic</SelectLabel>
          {topics.map((t, i) => (
            <SelectItem key={i} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
