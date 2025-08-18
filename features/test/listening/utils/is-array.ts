// cek answer/options is array
export function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string");
}

export function isString(str: unknown): str is string {
  return typeof str === "string";
}
