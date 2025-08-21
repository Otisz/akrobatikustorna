import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement>;

export default function PostsWrapper(props: Props) {
  const { children, className, ...rest } = props;
  return (
    <div className={cn("grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", className)} {...rest}>
      {children}
    </div>
  );
}
