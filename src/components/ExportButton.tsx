"use client";

import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Loader2, Image as ImageIcon } from 'lucide-react';

interface Props {
    targetId: string;
    name?: string;
}

const ExportButton: React.FC<Props> = ({ targetId, name = "2026-opening-card" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        const node = document.getElementById(targetId);
        if (!node) return;

        try {
            // 确保字体加载完成
            if (document.fonts) {
                await document.fonts.ready;
            }

            // 稍微等待渲染队列清空
            await new Promise(resolve => setTimeout(resolve, 300));

            // 优化导出设置
            const dataUrl = await toPng(node, {
                pixelRatio: 2, // 使用 2x 像素比进一步提升清晰度
                skipFonts: false,
                cacheBust: true, // 强制刷新缓存，解决某些情况下图片空白的问题
                backgroundColor: 'transparent',
                width: 1080,
                height: 1920,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                }
            });

            const link = document.createElement('a');
            link.download = `${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
            setError("导出失败，请尝试长按图片保存或截图。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2 w-full">
            <button
                onClick={handleExport}
                disabled={loading}
                className="w-full h-14 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-lg active:scale-95 transition-transform disabled:bg-gray-400"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        正在生成高清卡片...
                    </>
                ) : (
                    <>
                        <ImageIcon className="mr-2" size={20} />
                        保存这张卡片 (PNG)
                    </>
                )
                }
            </button>
            {error && <p className="text-red-500 text-center text-xs">{error}</p>}
        </div>
    );
};

export default ExportButton;
