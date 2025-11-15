import type React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface CardIndicator{
  description: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

export function CardIndicator({ title, icon, description }: CardIndicator){
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 align-middle">
          {icon && (icon)}
          <CardDescription className="text-md">{title}</CardDescription>
        </div>
        <CardTitle className="text-2xl font-semibold">{description}</CardTitle>
      </CardHeader>
    </Card>
  )
}
