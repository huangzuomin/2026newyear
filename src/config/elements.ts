export interface StyleElements {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    decorations?: string[];
    noise: boolean;
    shadow?: string;
    overlay?: string;
}

export const STYLE_MAP: Record<string, StyleElements> = {
    'warm': {
        background: 'bg-gradient-to-br from-[#FFFDF5] to-[#F9EBD3]',
        textPrimary: 'text-[#5C3D2E]', // 醒目的棕褐色
        textSecondary: 'text-[#A68F81]',
        accent: 'bg-[#D65A31]',
        noise: true,
        shadow: 'shadow-[#E8D5C4]/30'
    },
    'calm': {
        background: 'bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0] to-[#CED4DA]',
        textPrimary: 'text-[#0F172A]', // 深色文字确保可读性
        textSecondary: 'text-[#475569]',
        accent: 'bg-[#334155]',
        noise: true,
        shadow: 'shadow-slate-300/20'
    },
    'clear': {
        background: 'bg-[#FFFFFF]',
        textPrimary: 'text-[#020617]',
        textSecondary: 'text-[#64748B]',
        accent: 'bg-[#EB5E28]',
        noise: false,
        shadow: 'shadow-gray-200/40'
    },
    'firm': {
        background: 'bg-[#0F1115]', // 纯正黑灰底
        textPrimary: 'text-[#F8FAFC]',
        textSecondary: 'text-[#94A3B8]',
        accent: 'bg-[#FFFFFF]',
        noise: true,
        shadow: 'shadow-black/60',
        overlay: 'bg-gradient-to-t from-black/60 to-transparent'
    },
    'minimal': {
        background: 'bg-[#F9FAFB] border border-[#E5E7EB]',
        textPrimary: 'text-[#111827]',
        textSecondary: 'text-[#6B7280]',
        accent: 'bg-[#111827]',
        noise: false,
    },
    'modern': {
        background: 'bg-gradient-to-br from-[#EDF2FF] via-[#FFFFFF] to-[#F5F3FF]',
        textPrimary: 'text-[#1E1B4B]',
        textSecondary: 'text-[#4F46E5]',
        accent: 'bg-[#6366F1]',
        noise: true,
        decorations: ['glass-circle']
    },
    'guofeng': {
        background: 'bg-[#F7F3E9]', // 宣纸色
        textPrimary: 'text-[#2C1810]',
        textSecondary: 'text-[#7D7D7D]',
        accent: 'bg-[#991B1B]', // 宫廷红
        noise: true,
        decorations: ['ink-splash', 'border-classical']
    },
    'dynamic': {
        background: 'bg-[#4338CA] bg-gradient-to-br from-[#6366F1] via-[#A855F7] to-[#EC4899]',
        textPrimary: 'text-[#FFFFFF]',
        textSecondary: 'text-[#FFFFFF]/80',
        accent: 'bg-[#FFFFFF]',
        noise: true,
        shadow: 'shadow-indigo-500/30'
    }
};

// 候选 3 张的元素变体规则：确保每一张都有独特的高级感
export const GET_VARIANT_STYLE = (baseTone: string, variantIndex: number): StyleElements => {
    const tones = ['warm', 'calm', 'clear', 'firm', 'dynamic', 'modern'];
    const styles = ['minimal', 'modern', 'guofeng', 'dynamic'];

    if (variantIndex === 0) return STYLE_MAP[baseTone] || STYLE_MAP['clear'];

    // 第二张尝试切换到一个对比色或同色系的变体
    if (variantIndex === 1) {
        const nextTone = tones[(tones.indexOf(baseTone) + 2) % tones.length];
        return STYLE_MAP[nextTone];
    }

    // 第三张强制使用一种特殊设计风格
    const specialStyles = ['guofeng', 'dynamic', 'modern'];
    return STYLE_MAP[specialStyles[variantIndex % specialStyles.length]];
};
