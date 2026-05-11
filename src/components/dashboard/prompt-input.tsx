"use client";

import { Textarea } from "@/components/ui/textarea";

export function PromptInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        Describe your thumbnail
      </label>
      <div className="relative">
        <Textarea
          placeholder="A dark cinematic gaming thumbnail..."
          className="min-h-[140px] resize-none bg-background/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={500}
        />
        <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {value.length}/500
        </span>
      </div>
    </div>
  );
}
