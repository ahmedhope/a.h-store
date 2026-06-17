"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="p-2 hover:bg-muted rounded-xl transition-colors" title="نسخ">
      <Copy className={`h-4 w-4 ${copied ? "text-green-500" : "text-muted-foreground"}`} />
    </button>
  );
}
