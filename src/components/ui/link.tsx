"use client";

import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

const Link: typeof NextLink = (({ children, ...props }) => {
  const router = useRouter();

  const href = typeof props.href === "string" ? props.href : formatUrl(props.href);

  return (
    <NextLink
      prefetch={false}
      onMouseEnter={() => {
        router.prefetch(href);
      }}
      onMouseDown={(e) => {
        const url = new URL(href, window.location.href);
        if (
          url.origin === window.location.origin &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          router.push(href);
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}) as typeof NextLink;

export default Link;
