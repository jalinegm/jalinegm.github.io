import pt from "./pt.json";

type Dict = { [k: string]: string | Dict };

export function t(key: string, vars: Record<string, string | number> = {}): string {
  const found = key.split(".").reduce<string | Dict | undefined>(
    (node, part) => (typeof node === "object" && node !== null ? node[part] : undefined),
    pt as Dict,
  );
  if (typeof found !== "string") throw new Error(`Missing i18n key: ${key}`);
  return found.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}
