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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const handleExport = async () => {
        const node = document.getElementById(targetId);
        if (!node) return;

        setLoading(true);
        setError(null);

        try {
            if (document.fonts) {
                await document.fonts.ready;
            }
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(node, {
                pixelRatio: 2,
                skipFonts: false,
                cacheBust: true,
                backgroundColor: '#000000',
                width: 1080,
                height: 1920,
            });

            setPreviewUrl(dataUrl);

            // 检查是否在微信内
            const isWechat = /micromessenger/i.test(navigator.userAgent);

            if (isWechat) {
                // 微信环境：显示浮层引导长按保存
                setShowOverlay(true);
            } else {
                // 普通浏览器：直接下载
                const link = document.createElement('a');
                link.download = `${name}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error("Export failed:", err);
            setError("生成失败，请尝试刷新页面。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2 w-full">
            <button
                onClick={handleExport}
                disabled={loading}
                className="w-full h-14 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-lg active:scale-95 transition-transform disabled:bg-gray-400"
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
                )}
            </button>
            {error && <p className="text-red-500 text-center text-xs">{error}</p>}

            {/* 微信保存浮层 */}
            {showOverlay && previewUrl && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300"
                    onClick={() => setShowOverlay(false)}
                >
                    <div className="relative w-full max-w-[320px] aspect-[9/16] shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                        <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                    </div>
                    <div className="mt-8 text-center space-y-2">
                        <p className="text-white font-bold text-lg">高清卡片已生成</p>
                        <p className="text-white/60 text-sm">长按上方图片，选择「保存到相册」</p>
                        <button
                            className="mt-6 px-8 py-2 bg-white/10 border border-white/20 rounded-full text-xs text-white/40"
                            onClick={() => setShowOverlay(false)}
                        >
                            点击空白处关闭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportButton;
