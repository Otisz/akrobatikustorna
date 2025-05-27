import kebabCase from "lodash/kebabCase";
import type { FieldHook } from "payload";

export function formatSlug(val: string): string {
  let sanitized: string;

  sanitized = val.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    "",
  );

  sanitized = kebabCase(sanitized);

  return sanitized;
}

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === "string") {
      return formatSlug(value);
    }

    if (operation === "create" || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback];

      if (fallbackData && typeof fallbackData === "string") {
        return formatSlug(fallbackData);
      }
    }

    return value;
  };
