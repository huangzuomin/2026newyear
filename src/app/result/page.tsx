"use client";

import React, { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import CardRenderer from '@/components/CardRenderer';
import ExportButton from '@/components/ExportButton';
import SharePanel from '@/components/SharePanel';
import { TEMPLATES } from '@/config/templates';
import { GET_VARIANT_STYLE } from '@/config/elements';

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">正在进入终点...</div>}>
            <ResultContent />
        </Suspense>
    );
}

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const data = useMemo(() => {
        const params: Record<string, any> = {};
        searchParams.forEach((v, k) => {
            params[k] = v;
        });
        return params;
    }, [searchParams]);

    const tplId = data.tpl;
    const config = TEMPLATES.find(t => t.id === tplId);
    const styleIndex = parseInt(data.styleIndex || "0");
    const variantStyle = GET_VARIANT_STYLE(data.tone || 'clear', styleIndex);

    if (!tplId || !config) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-orange-50 text-orange-600 p-4 rounded-xl text-sm">
                    未找到有效的卡片数据，请返回重新制作。
                </div>
                <Link href="/" className="text-brand-500 font-bold">返回首页</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
            {/* 背景氛围装饰 */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="px-6 h-16 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-20 border-b border-white/5">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-sm font-black tracking-widest uppercase opacity-80">结果预览</div>
                <Link href={`/create/${tplId}`} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                    <RefreshCw size={20} />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto pb-12">
                <div className="max-w-md mx-auto px-6 py-8 space-y-10">
                    {/* 卡片展示 */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
                        <div className="relative transform rotate-1">
                            <CardRenderer tpl={tplId} params={data} styleOverride={variantStyle} />
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-6 font-medium px-4">长按图片可手动保存，或点击下方按钮导出全高清版</p>
                    </div>

                    {/* 操作区 */}
                    <div className="space-y-6">
                        <ExportButton targetId="card-capture-target-export" name={`2026-card-${tplId}`} />
                        <SharePanel tplName={config.name} shareUrl={data._shareUrl || ''} />
                    </div>
                </div>
            </div>

            {/* 隐藏的导出专用节点：使用 fixed 定位并移出可视区，确保渲染树完整 */}
            <div className="fixed top-0 left-[-2000px] pointer-events-none z-[-100]">
                <CardRenderer tpl={tplId} params={data} styleOverride={variantStyle} isExporting={true} />
            </div>
        </main>
    );
}
