"use client";

import React from 'react';
import CardRenderer from './CardRenderer';
import { GET_VARIANT_STYLE } from '@/config/elements';
import { cn } from '@/lib/utils';

interface Props {
    tpl: string;
    params: Record<string, any>;
    variants?: string[];
    isGenerating?: boolean;
    onSelect: (variantIndex: number) => void;
    selectedIndex: number;
}

const CandidateGrid: React.FC<Props> = ({ tpl, params, variants, isGenerating, onSelect, selectedIndex }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest">选择你喜欢的款式</h3>
                {isGenerating && (
                    <span className="text-[10px] text-brand-500 animate-pulse font-bold flex items-center">
                        <span className="w-1 h-1 bg-brand-500 rounded-full mr-1 animate-bounce" />
                        AI 正在构思变体...
                    </span>
                )}
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => {
                    const variantStyle = GET_VARIANT_STYLE(params.tone || 'clear', idx);
                    const displayParams = {
                        ...params,
                        _aiVariant: idx === 0 ? undefined : variants?.[idx]
                    };
                    return (
                        <div key={idx} className="flex flex-col gap-2">
                            <button
                                onClick={() => onSelect(idx)}
                                className={cn(
                                    "relative transition-all duration-500 overflow-hidden rounded-2xl group",
                                    selectedIndex === idx
                                        ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-white shadow-lg shadow-brand-500/20 scale-105 z-10"
                                        : "ring-1 ring-black/5 opacity-60 grayscale-[0.2] hover:opacity-100 hover:grayscale-0 hover:ring-black/10"
                                )}
                            >
                                <div className="bg-slate-200"> {/* 垫底色，防止白卡片在白底上看不清边缘 */}
                                    <CardRenderer tpl={tpl} params={displayParams} styleOverride={variantStyle} isThumbnail={true} />
                                </div>

                                {isGenerating && idx > 0 && (
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
                                        <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/5 group-active:bg-black/10 transition-colors pointer-events-none" />
                            </button>
                            <span className={cn(
                                "text-[10px] text-center font-bold uppercase tracking-wider",
                                selectedIndex === idx ? "text-brand-500 scale-110 transition-transform" : "text-gray-400"
                            )}>
                                款式 {idx + 1}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CandidateGrid;
