import { FieldErrors, FieldValues } from "react-hook-form";

export type FlatError = {
  path: string;
  message: string;
};

export function flattenErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
  parentPath = "",
): FlatError[] {
  let result: FlatError[] = [];

  for (const key in errors) {
    const fieldError = errors[key];
    if (!fieldError) continue;

    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if ("message" in fieldError && fieldError.message) {
      result.push({
        path: currentPath,
        message: String(fieldError.message),
      });
    }

    if (
      typeof fieldError === "object" &&
      fieldError !== null &&
      !("message" in fieldError)
    ) {
      result = result.concat(
        flattenErrors(fieldError as FieldErrors, currentPath),
      );
    }
  }

  return result;
}

export function prettyPath(path: string) {
  return path
    .split(".")
    .map((part, idx, arr) => {
      if (/^\d+$/.test(part)) {
        const prev = arr[idx - 1];
        if (prev === "passages") return `Passage ${Number(part) + 1}`;
        if (prev === "questionGroups")
          return `Question Group ${Number(part) + 1}`;
        if (prev === "questions") return `Question ${Number(part) + 1}`;
        return `Item ${Number(part) + 1}`;
      }

      // skip container keys
      if (["passages", "questionGroups", "questions"].includes(part)) {
        return null;
      }

      // snake_case → Title Case
      return part.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    })
    .filter(Boolean)
    .join(", ");
}
