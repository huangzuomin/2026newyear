export type TemplateId = 'T01' | 'T02' | 'T03' | 'T04';

export interface TemplateConfig {
    id: TemplateId;
    name: string;
    fields: {
        key: string;
        label: string;
        type: 'select' | 'input' | 'text';
        options?: { label: string; value: string }[];
        placeholder?: string;
        maxLength?: number;
        required: boolean;
    }[];
    defaultParams: Record<string, string>;
    // 新增：支持图片背景和自定义布局
    backgroundImage?: string;
    layout?: {
        textClassName?: string;
        qrPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'center';
        qrSize?: number;
    };
}

export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'T01',
        name: '新年状态声明卡',
        // backgroundImage 将通过 getT01BackgroundImage() 动态生成
        fields: [
            { key: 'topic_id', label: '我的主张', type: 'select', required: true },
            {
                key: 'tone', label: '视觉色调', type: 'select', required: true,
                options: [
                    { label: '温润 Warm', value: 'warm' },
                    { label: '冷静 Calm', value: 'calm' },
                    { label: '明亮 Clear', value: 'clear' },
                    { label: '坚定 Firm', value: 'firm' }
                ]
            },
            {
                key: 'style', label: '视觉风格', type: 'select', required: false,
                options: [
                    { label: '极简 Minimal', value: 'minimal' },
                    { label: '现代 Modern', value: 'modern' },
                    { label: '国风 Guofeng', value: 'guofeng' }
                ]
            },
            { key: 'signature', label: '落款 (可选)', type: 'input', maxLength: 6, required: false, placeholder: '你的名字/地名' }
        ],
        defaultParams: {
            topic_id: '01',
            tone: 'clear',
            style: 'modern',
            signature: ''
        }
    },
    {
        id: 'T02',
        name: '年度交接卡',
        fields: [
            { key: 'learned', label: '2025 学会了', type: 'input', maxLength: 6, required: true, placeholder: '一个关键词' },
            { key: 'try', label: '2026 去尝试', type: 'input', maxLength: 6, required: true, placeholder: '一个关键词' },
            {
                key: 'tone', label: '视觉色调', type: 'select', required: true,
                options: [
                    { label: '温润 Warm', value: 'warm' },
                    { label: '冷静 Calm', value: 'calm' },
                    { label: '明亮 Clear', value: 'clear' },
                    { label: '坚定 Firm', value: 'firm' }
                ]
            },
            {
                key: 'style', label: '视觉风格', type: 'select', required: false,
                options: [
                    { label: '极简 Minimal', value: 'minimal' },
                    { label: '现代 Modern', value: 'modern' },
                    { label: '国风 Guofeng', value: 'guofeng' }
                ]
            }
        ],
        defaultParams: {
            learned: '',
            try: '',
            tone: 'warm',
            style: 'minimal'
        }
    },
    {
        id: 'T03',
        name: '新年角色卡',
        fields: [
            { key: 'role_id', label: '我的角色', type: 'select', required: true },
            {
                key: 'tone', label: '视觉色调', type: 'select', required: true,
                options: [
                    { label: '温润 Warm', value: 'warm' },
                    { label: '冷静 Calm', value: 'calm' },
                    { label: '明亮 Clear', value: 'clear' },
                    { label: '坚定 Firm', value: 'firm' }
                ]
            },
            {
                key: 'style', label: '视觉风格', type: 'select', required: false,
                options: [
                    { label: '极简 Minimal', value: 'minimal' },
                    { label: '现代 Modern', value: 'modern' },
                    { label: '国风 Guofeng', value: 'guofeng' }
                ]
            }
        ],
        defaultParams: {
            role_id: 'r1',
            tone: 'warm',
            style: 'minimal'
        }
    },
    {
        id: 'T04',
        name: '温州地标寄语卡',
        fields: [
            { key: 'recipient', label: '祝福对象', type: 'input', maxLength: 12, required: true, placeholder: '致：亲爱的自己' },
            {
                key: 'theme', label: '新年愿望', type: 'select', required: true,
                options: [
                    { label: '平安', value: '平安' },
                    { label: '奋斗', value: '奋斗' },
                    { label: '重逢', value: '重逢' },
                    { label: '热爱', value: '热爱' },
                    { label: '自由', value: '自由' },
                    { label: '健康', value: '健康' },
                    { label: '圆满', value: '圆满' },
                    { label: '顺遂', value: '顺遂' }
                ]
            },
            { key: 'signature', label: '署名', type: 'input', maxLength: 8, required: true, placeholder: '你的名字' },
            {
                key: 'landmark_id', label: '选择地区', type: 'select', required: true,
                options: [
                    { label: '温州市全域', value: 'wenzhou' },
                    { label: '鹿城区', value: 'lucheng' },
                    { label: '龙湾区', value: 'longwan' },
                    { label: '瓯海区', value: 'ouhai' },
                    { label: '洞头区', value: 'dongtou' },
                    { label: '瑞安市', value: 'ruian' },
                    { label: '乐清市', value: 'yueqing' },
                    { label: '龙港市', value: 'longgang' },
                    { label: '永嘉县', value: 'yongjia' },
                    { label: '平阳县', value: 'pingyang' },
                    { label: '苍南县', value: 'cangnan' },
                    { label: '文成县', value: 'wencheng' },
                    { label: '泰顺县', value: 'taishun' }
                ]
            }
        ],
        defaultParams: {
            recipient: '致自己',
            theme: '平安',
            signature: '署名',
            landmark_id: 'wenzhou'
        },
        layout: {
            qrPosition: 'bottom-right',
            qrSize: 80
        }
    }
];

/**
 * 根据色调和风格参数动态生成 T01 模板的背景图片路径
 * @param tone - 视觉色调: warm | calm | clear | firm
 * @param style - 视觉风格: minimal | modern | guofeng
 * @returns 背景图片路径
 */
export function getT01BackgroundImage(tone: string, style: string): string {
    const toneMap: Record<string, string> = {
        warm: 'Warm',
        calm: 'Calm',
        clear: 'Clear',
        firm: 'Firm'
    };

    const styleMap: Record<string, string> = {
        minimal: 'Minimal',
        modern: 'Modern',
        guofeng: 'Guofeng'
    };

    const mappedTone = toneMap[tone?.toLowerCase()] || 'Clear';
    const mappedStyle = styleMap[style?.toLowerCase()] || 'Modern';

    return `/templates/T01/${mappedStyle}_${mappedTone}.png`;
}
export function getT02BackgroundImage(tone: string, style: string): string {
    const toneMap: Record<string, string> = {
        warm: 'Warm', calm: 'Calm', clear: 'Clear', firm: 'Firm'
    };
    const styleMap: Record<string, string> = {
        minimal: 'Minimal', modern: 'Modern', guofeng: 'Guofeng'
    };
    const mappedTone = toneMap[tone?.toLowerCase()] || 'Warm';
    const mappedStyle = styleMap[style?.toLowerCase()] || 'Minimal';

    return `/templates/T02/${mappedStyle}_${mappedTone}.png`;
}
export function getT03BackgroundImage(tone: string, style: string): string {
    const toneMap: Record<string, string> = {
        warm: 'Warm', calm: 'Calm', clear: 'Clear', firm: 'Firm'
    };
    const styleMap: Record<string, string> = {
        minimal: 'Minimal', modern: 'Modern', guofeng: 'Guofeng'
    };
    const mappedTone = toneMap[tone?.toLowerCase()] || 'Warm';
    const mappedStyle = styleMap[style?.toLowerCase()] || 'Minimal';

    return `/templates/T03/${mappedStyle}_${mappedTone}.png`;
}
export function getT04BackgroundImage(landmarkId: string): string {
    // 13 个行政区对应的实景图路径 (默认为 jpg，适配写实风格)
    return `/templates/T04/${landmarkId || 'wenzhou'}.png`;
}
