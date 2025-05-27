"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type VIDEOS from "@/data/videos";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: (typeof VIDEOS)[number]["name"];
};

export default function InterceptingModal(props: Props) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
