import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 文本适配策略：最大22字，超长自动缩小或截断
 * 返回 CSS 类名或样式对象
 */
export function fitTextStyle(text: string, maxChars = 22) {
    const len = text.length;
    if (len <= 10) return "text-3xl font-bold leading-tight";
    if (len <= 15) return "text-2xl font-bold leading-tight";
    if (len <= 22) return "text-xl font-semibold leading-relaxed";
    return "text-lg font-semibold leading-relaxed truncate-lines-2";
}

export function truncateText(text: string, max = 22) {
    if (text.length <= max) return text;
    return text.slice(0, max - 1) + "...";
}

export function buildShareUrl(origin: string, tpl: string, params: Record<string, string>) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v) searchParams.set(k, v);
    });
    return `${origin}/create/${tpl}?${searchParams.toString()}`;
}
