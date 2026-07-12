"use client";

import { Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CreditBalanceProps {
  balance: number;
  className?: string;
}

export function CreditBalance({ balance, className }: CreditBalanceProps) {
  return (
    <Card className={cn("inline-flex", className)}>
      <CardContent className="flex items-center gap-3 py-3 px-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
          <Coins className="size-5 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums">{balance}</div>
          <div className="text-xs text-muted-foreground">
            credit{balance !== 1 ? "s" : ""} remaining
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
