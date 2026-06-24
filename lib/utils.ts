import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["js", "jsx", "ts", "tsx"].includes(ext || "")) return "javascript";
  if (["html"].includes(ext || "")) return "html";
  if (["css", "scss"].includes(ext || "")) return "css";
  if (["json"].includes(ext || "")) return "json";
  if (["py"].includes(ext || "")) return "python";
  return "file";
}
