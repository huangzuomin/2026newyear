import { blockedWords } from "@/config/blockedWords";

export function validateInput(text: string): { success: boolean; message?: string } {
    if (!text) return { success: true };

    // 敏感词过滤
    for (const word of blockedWords) {
        if (text.includes(word)) {
            return { success: false, message: `输入包含不当内容：${word}` };
        }
    }

    // 字符集限制：仅中英文数字空格
    const safeCharRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s]*$/;
    if (!safeCharRegex.test(text)) {
        return { success: false, message: "仅支持中英文、数字及空格" };
    }

    return { success: true };
}
