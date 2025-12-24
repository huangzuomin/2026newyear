import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { text, tone, tpl, landmark_id } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Missing text' }, { status: 400 });
        }

        const landmarkMap: Record<string, string> = {
            wenzhou: '温州', lucheng: '鹿城', longwan: '龙湾', ouhai: '瓯海', dongtou: '洞头',
            ruian: '瑞安', yueqing: '乐清', longgang: '龙港', yongjia: '永嘉', pingyang: '平阳',
            cangnan: '苍南', wencheng: '文成', taishun: '泰顺'
        };
        const landmarkName = landmarkMap[landmark_id] || '温州';

        const apiKey = process.env.SILICONFLOW_API_KEY;
        const model = process.env.AI_MODEL || 'deepseek-ai/DeepSeek-V3';
        const baseUrl = process.env.AI_BASE_URL || 'https://api.siliconflow.cn/v1';

        // ... (apiKey check)

        const prompt = `
你是一个新年卡片文案助手。当前背景是【2026年元旦】。
你的任务是根据用户提供的【原始文案】（通常是一个新年愿望关键词）和【语气偏好】，创作 2 条不同的新年祝福。

【原始文案】：${text}
【语气偏好】：${tone}
【模板类型】：${tpl}
${tpl === 'T04' ? `【所在地区】：${landmarkName}` : ''}

规则：
1. 每条文案必须在 22 个字符以内。
2. 保持核心意思不变，仅微调措辞。
3. **严格时空约束**：如果原始文案中包含年份，请务必将其改为 2026。绝对禁止在文案中出现 2024、2025 等非 2026 的年份数字。
4. **T02 专项逻辑**：如果模板类型是 T02，请务必保留 "/" 分隔符。前部分为 2025 的沉淀/感悟，后部分为 2026 的爆发/行动。文案应富有诗意或力量感。示例格式："学会克制 / 奔赴山海"。
5. **T03 专项逻辑**：如果模板类型是 T03，生成角色称谓时应更具个性化和力量感。例如将“探索者”优化为“星辰探索者”。
6. **T04 专项逻辑**：如果模板类型是 T04，任务是生成一句**极具高级感、诗意、优雅**的【金句寄语】。
   - **核心要求**：将用户的愿望关键词（${text}）与【所在地区】（${landmarkName}）的**独有**标志性意象深度交融。
   - **严格约束**：**绝对禁止**出现非该地区的景点。例如：如果是“鹿城”，绝不能出现“楠溪江”（永嘉）、“雁荡山”（乐清）等其他地标。只描写属于【${landmarkName}】的风物（如鹿城的五马街、江心屿、瓯江等）。
   - **风格指南**：拒绝低质祝福语，追求文学性，用词考究，意境悠远。可以使用对偶句或意象叠加的短句。
   - **长度约束**：不限字数，但建议保持在 12-24 字之间，确保排版美观。
   - **示例**：
     - (乐清+奋斗) -> "雁荡凌云志，向山海之巅，续写英雄诗篇。"
     - (温州+平安) -> "瓯江水暖，流光溢彩，愿万家灯火皆是温柔岁时。"
     - (通用+自由) -> "心有山海，静而无边，所求皆如愿。"
7. 返回格式必须是 JSON 数组：["金句变体1", "金句变体2"]。
8. 不要返回任何解释性文字，只返回 JSON。
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
