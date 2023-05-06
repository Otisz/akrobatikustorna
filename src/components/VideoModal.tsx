"use client";

import VIDEOS from "@/data/videos";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";

export default function VideoModal() {
  const query = useSearchParams();
  const router = useRouter();

  return (
    <Transition.Root show={!!query.get("v")} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => router.push("/galeria")}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                <iframe
                  width="100%"
                  className="aspect-video"
                  src={`https://www.youtube.com/embed/${query.get("v")}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={VIDEOS.find((video) => video.v === query.get("v"))?.name?.toString()}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
