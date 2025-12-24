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
                key: 'tone', label: '色调', type: 'select', required: false,
                options: [
                    { label: '温润 Warm', value: 'warm' },
                    { label: '冷静 Calm', value: 'calm' }
                ]
            }
        ],
        defaultParams: {
            learned: '',
            try: '',
            tone: 'warm'
        }
    },
    {
        id: 'T03',
        name: '新年角色卡',
        fields: [
            { key: 'role_id', label: '我的角色', type: 'select', required: true }
        ],
        defaultParams: {
            role_id: 'r1'
        }
    },
    {
        id: 'T04',
        name: '山水意境卡',
        backgroundImage: '/templates/my-design.png',
        fields: [
            { key: 'title', label: '主标题', type: 'input', maxLength: 20, required: true, placeholder: '新年寄语' },
            { key: 'subtitle', label: '副标题', type: 'input', maxLength: 30, required: false, placeholder: '一句话描述' },
            {
                key: 'textPosition', label: '文字位置', type: 'select', required: false,
                options: [
                    { label: '居中', value: 'center' },
                    { label: '上方', value: 'top' },
                    { label: '下方', value: 'bottom' }
                ]
            }
        ],
        defaultParams: {
            title: '2026 新年快乐',
            subtitle: '山高水长，未来可期',
            textPosition: 'center'
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

    return `/templates/T01/${mappedStyle} + ${mappedTone}.png`;
}
