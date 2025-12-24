import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, tone, tpl } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Missing text' }, { status: 400 });
        }

        const apiKey = process.env.SILICONFLOW_API_KEY;
        const model = process.env.AI_MODEL || 'deepseek-ai/DeepSeek-V3';
        const baseUrl = process.env.AI_BASE_URL || 'https://api.siliconflow.cn/v1';

        // 如果没有 API Key，返回模拟数据作为兜底
        if (!apiKey) {
            console.warn('AI API Key is missing. Returning fallback data.');
            return NextResponse.json({
                variants: [
                    `${text} (风格A)`,
                    `${text} (风格B)`
                ]
            });
        }

        const prompt = `
你是一个新年卡片文案助手。当前背景是【2026年元旦】。
你的任务是根据用户提供的【原始文案】和【语气偏好】，创作 2 条（另外两条）不同的新年祝福或声明。

【原始文案】：${text}
【语气偏好】：${tone}
【模板类型】：${tpl}

规则：
1. 每条文案必须在 22 个字符以内。
2. 保持核心意思不变，仅微调措辞。
3. **严格时空约束**：如果原始文案中包含年份，请务必将其改为 2026。绝对禁止在文案中出现 2024、2025 等非 2026 的年份数字。
4. 如果模板类型是 T02，请务必保留 "/" 分隔符，格式如 "变体后的2025感悟 / 变体后的2026计划"。
5. 返回格式必须是 JSON 数组：["变体文案1", "变体文案2"]。
6. 不要返回任何解释性文字，只返回 JSON。
`;

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: '你是一个专业的文案输出引擎，只返回 JSON 格式结果。' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        let variants = [];

        try {
            const content = data.choices[0].message.content;
            // 尝试解析 JSON
            const parsed = JSON.parse(content);
            variants = Array.isArray(parsed) ? parsed : (parsed.variants || Object.values(parsed)[0]);
        } catch (e) {
            console.error('Failed to parse AI response:', e);
            // 兜底：如果解析失败，提供基本变体
            variants = [text, text];
        }

        return NextResponse.json({ variants: variants.slice(0, 2) });

    } catch (error) {
        console.error('AI API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
