import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
}

export function KpiCard({ title, value, change, changeLabel, icon: Icon, iconColor = "text-primary" }: KpiCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("rounded-md p-2 bg-primary/10", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1 text-xs">
              {isPositive && <TrendingUp className="h-3 w-3 text-emerald-600 mr-1" />}
              {isNegative && <TrendingDown className="h-3 w-3 text-red-600 mr-1" />}
              {!isPositive && !isNegative && <Minus className="h-3 w-3 text-muted-foreground mr-1" />}
              <span className={cn(
                isPositive && "text-emerald-600",
                isNegative && "text-red-600",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && "+"}{change.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="text-muted-foreground ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
