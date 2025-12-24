"use client";

import React from 'react';
import { cn, fitTextStyle, truncateText } from '@/lib/utils';
import { STYLE_MAP, StyleElements } from '@/config/elements';
import { TEMPLATES, getT01BackgroundImage } from '@/config/templates';
import QRCodeBlock from './QRCodeBlock';
import topics from '@/config/topics.json';
import roles from '@/config/roles.json';

interface CardRendererProps {
    tpl: string;
    params: Record<string, any>;
    styleOverride?: StyleElements;
    isExporting?: boolean;
    isThumbnail?: boolean;
}

const CardRenderer: React.FC<CardRendererProps> = ({ tpl, params, styleOverride, isExporting, isThumbnail }) => {
    const baseStyle = STYLE_MAP[params.style] || STYLE_MAP[params.tone] || STYLE_MAP['clear'];
    const style = styleOverride || baseStyle;

    // 基础缩放因子
    const scale = isExporting ? 3 : 1;
    const padding = isThumbnail ? 16 : (28 * scale);

    const getPrimaryColor = () => {
        const hexMatch = style.textPrimary.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
        return hexMatch ? hexMatch[0] : '#000000';
    };

    const getSecondaryColor = () => {
        const hexMatch = style.textSecondary.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
        return hexMatch ? hexMatch[0] : '#666666';
    };

    const primaryColor = getPrimaryColor();

    const renderDecoration = (d: string, i: number) => {
        switch (d) {
            case 'ink-splash':
                return <div key={i} className="absolute -top-12 -right-12 w-64 h-64 opacity-[0.08] bg-black rounded-full blur-[90px] pointer-events-none" style={{ transform: `scale(${scale})` }} />;
            case 'glass-circle':
                return (
                    <div key={i} className="absolute top-1/4 -left-20 w-72 h-72 rounded-full border border-white/30 pointer-events-none overflow-hidden" style={{ transform: `scale(${scale})` }}>
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl shadow-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                    </div>
                );
            case 'border-classical':
                return <div key={i} className="absolute inset-6 border border-current opacity-10 pointer-events-none" style={{ borderWidth: 1 * scale, margin: 12 * scale }} />;
            default:
                return null;
        }
    };


    const renderContent = () => {
        const primaryColor = getPrimaryColor();
        const secondaryColor = getSecondaryColor();

        switch (tpl) {
            case 'T01': {
                const topic = params._aiVariant || topics.find(t => t.id === params.topic_id)?.text || "保持热爱";

                return (
                    <div className="flex flex-col h-full justify-between relative z-10" style={{ padding }}>
                        <div className="space-y-4">
                            {!isThumbnail && (
                                <div className="font-black tracking-tighter leading-none select-none"
                                    style={{
                                        fontSize: 130 * scale,
                                        color: hasBackgroundImage ? 'rgba(255, 255, 255, 0.08)' : 'inherit',
                                        mixBlendMode: hasBackgroundImage ? 'soft-light' : 'overlay',
                                        opacity: hasBackgroundImage ? 1 : 0.05
                                    }}>
                                    2026
                                </div>
                            )}
                            <div className={cn(
                                "font-bold tracking-tight text-balance",
                                isThumbnail ? "text-base mt-2" : fitTextStyle(topic)
                            )} style={{
                                fontSize: isThumbnail ? undefined : (len => {
                                    if (len <= 10) return 42 * scale;
                                    if (len <= 15) return 32 * scale;
                                    return 24 * scale;
                                })(topic.length),
                                marginTop: isThumbnail ? undefined : -20 * scale,
                                color: hasBackgroundImage ? '#FFFFFF' : primaryColor,
                                lineHeight: 1.15,
                                textShadow: hasBackgroundImage ? '0 2px 12px rgba(0,0,0,0.4)' : 'none'
                            }}>
                                {truncateText(topic, isThumbnail ? 12 : 40)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {params.signature && !isThumbnail && (
                                <div className="text-right font-serif italic opacity-90"
                                    style={{
                                        fontSize: 18 * scale,
                                        color: hasBackgroundImage ? '#FFFFFF' : secondaryColor,
                                        textShadow: hasBackgroundImage ? '0 1px 8px rgba(0,0,0,0.3)' : 'none'
                                    }}>
                                    —— {params.signature}
                                </div>
                            )}
                            {!isThumbnail && (
                                <div className="flex items-end justify-between pt-6">
                                    {/* 左侧品牌区域 - 大师级设计 */}
                                    <div className="space-y-3">
                                        {/* 装饰性分隔线 */}
                                        <div
                                            className="h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent rounded-full"
                                            style={{
                                                width: 80 * scale,
                                                boxShadow: '0 1px 2px rgba(255,255,255,0.1)'
                                            }}
                                        />

                                        {/* 主品牌名称 */}
                                        <div className="space-y-1">
                                            <p className="font-bold tracking-wide"
                                                style={{
                                                    fontSize: 11 * scale,
                                                    color: hasBackgroundImage ? '#FFFFFF' : primaryColor,
                                                    letterSpacing: '0.12em',
                                                    textShadow: hasBackgroundImage ? '0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)' : 'none',
                                                    fontWeight: 600
                                                }}>
                                                温州市新闻传媒中心
                                            </p>
                                            <p className="uppercase tracking-[0.25em] opacity-50 font-medium"
                                                style={{
                                                    fontSize: 7 * scale,
                                                    color: hasBackgroundImage ? '#FFFFFF' : secondaryColor,
                                                    letterSpacing: '0.28em',
                                                    textShadow: hasBackgroundImage ? '0 1px 4px rgba(0,0,0,0.2)' : 'none'
                                                }}>
                                                WENZHOU MEDIA CENTER
                                            </p>
                                        </div>

                                        {/* 副标题 */}
                                        <p className="opacity-40 font-medium tracking-wide"
                                            style={{
                                                fontSize: 8 * scale,
                                                color: hasBackgroundImage ? '#FFFFFF' : secondaryColor,
                                                letterSpacing: '0.08em',
                                                textShadow: hasBackgroundImage ? '0 1px 4px rgba(0,0,0,0.15)' : 'none'
                                            }}>
                                            扫码开启我的新年
                                        </p>
                                    </div>

                                    {/* 右侧二维码 */}
                                    <div className="p-1 bg-white rounded-lg shadow-lg" style={{
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={46 * scale} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case 'T02': {
                const parts = params._aiVariant?.split('/') || [params.learned || "经历与成长", params.try || "探索与热爱"];
                const learned = parts[0]?.trim();
                const action = parts[1]?.trim();

                return (
                    <div className="flex flex-col h-full relative z-10" style={{ padding, color: primaryColor }}>
                        {!isThumbnail && (
                            <div className="opacity-[0.03] font-black uppercase leading-none mb-8 select-none"
                                style={{ fontSize: 64 * scale, mixBlendMode: 'overlay' }}>
                                RECAP / VISION
                            </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center space-y-12" style={{ gap: 32 * scale }}>
                            <div className="space-y-3">
                                <p className="uppercase tracking-[0.3em] opacity-40 font-bold" style={{ fontSize: 10 * scale, color: secondaryColor }}>2025 Learned</p>
                                <p className="font-bold leading-snug tracking-tight text-balance" style={{ fontSize: (isThumbnail ? 15 : 32) * scale, color: 'inherit' }}>{learned}</p>
                            </div>
                            <div className="w-16 h-[2px] bg-current opacity-20 rounded-full" style={{ width: 60 * scale }} />
                            <div className="space-y-3">
                                <p className="uppercase tracking-[0.3em] opacity-40 font-bold" style={{ fontSize: 10 * scale, color: secondaryColor }}>2026 Action</p>
                                <p className="font-bold leading-snug tracking-tight text-balance" style={{ fontSize: (isThumbnail ? 15 : 32) * scale, color: 'inherit' }}>{action}</p>
                            </div>
                        </div>
                        {!isThumbnail && (
                            <div className="flex items-end justify-between mt-auto pt-8 border-t border-current/10">
                                <div className="font-black italic tracking-tighter" style={{ fontSize: 36 * scale }}>2026.</div>
                                <div className="p-1 bg-white rounded-lg shadow-sm">
                                    <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={40 * scale} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            case 'T03': {
                const role = roles.find(r => r.id === params.role_id) || roles[0];
                const roleName = params._aiVariant || role.name;
                return (
                    <div className="flex flex-col h-full items-center justify-center text-center relative z-10" style={{ padding, color: primaryColor }}>
                        <div className="w-full border-[6px] border-current p-10 flex flex-col items-center relative overflow-hidden"
                            style={{ borderWidth: 5 * scale, padding: 40 * scale }}>
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-current" style={{ width: 12 * scale, height: 12 * scale }} />
                            <span className="uppercase tracking-[0.5em] opacity-40 font-bold" style={{ fontSize: 12 * scale, marginBottom: 16 * scale }}>2026 属于</span>
                            <span className="font-black tracking-widest text-balance" style={{ fontSize: (isThumbnail ? 22 : 48) * scale, margin: (isThumbnail ? 8 : 28) * scale }}>"{roleName}"</span>
                            <span className="uppercase tracking-[0.5em] opacity-40 font-bold" style={{ fontSize: 12 * scale }}>的人</span>
                        </div>
                        {!isThumbnail && (
                            <>
                                <p className="opacity-60 italic mt-10 max-w-[85%] leading-relaxed font-serif" style={{ fontSize: 16 * scale, marginTop: 40 * scale }}>{role.desc}</p>
                                <div className="mt-auto flex flex-col items-center gap-4">
                                    <div className="p-1 bg-white rounded-lg shadow-sm">
                                        <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={44 * scale} />
                                    </div>
                                    <span className="uppercase text-[9px] tracking-[0.25em] opacity-40 font-bold" style={{ fontSize: 9 * scale }}>Scan to discover your role</span>
                                </div>
                            </>
                        )}
                    </div>
                );
            }

            case 'T04': {
                const title = params.title || '2026 新年快乐';
                const subtitle = params.subtitle || '';
                const textPosition = params.textPosition || 'center';

                const getPositionStyles = () => {
                    switch (textPosition) {
                        case 'top':
                            return 'justify-start pt-20';
                        case 'bottom':
                            return 'justify-end pb-20';
                        default:
                            return 'justify-center';
                    }
                };

                return (
                    <div className={cn("flex flex-col h-full items-center relative z-10", getPositionStyles())} style={{ padding }}>
                        <div className="text-center space-y-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            <h1 className="font-black tracking-tight text-balance leading-tight"
                                style={{
                                    fontSize: (isThumbnail ? 24 : 56) * scale,
                                    color: '#FFFFFF'
                                }}>
                                {truncateText(title, isThumbnail ? 10 : 20)}
                            </h1>
                            {subtitle && !isThumbnail && (
                                <p className="font-medium tracking-wide opacity-90"
                                    style={{
                                        fontSize: 20 * scale,
                                        color: '#FFFFFF'
                                    }}>
                                    {truncateText(subtitle, 30)}
                                </p>
                            )}
                        </div>

                        {!isThumbnail && (
                            <div className="absolute bottom-8 right-8 p-2 bg-white rounded-xl shadow-lg">
                                <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={80 * scale} />
                            </div>
                        )}
                    </div>
                );
            }

            default:
                return null;
        }
    };

    // 获取当前模板配置
    const currentTemplate = TEMPLATES.find(t => t.id === tpl);

    // T01 使用动态背景,其他模板使用静态配置
    const getBackgroundImage = () => {
        if (tpl === 'T01') {
            return getT01BackgroundImage(params.tone || 'clear', params.style || 'modern');
        }
        return currentTemplate?.backgroundImage;
    };

    const hasBackgroundImage = tpl === 'T01' || currentTemplate?.backgroundImage;
    const backgroundImageUrl = getBackgroundImage();

    return (
        <div
            id={isExporting ? "card-capture-target-export" : "card-capture-target"}
            className={cn(
                "relative overflow-hidden transition-all duration-500",
                !hasBackgroundImage && style.background,
                style.textPrimary,
                !isExporting && !isThumbnail && "rounded-[2.5rem] card-shadow aspect-[9/16]",
                isExporting ? "w-[1080px] h-[1920px]" : "w-full max-w-[360px] mx-auto",
                !isExporting && isThumbnail && "rounded-2xl aspect-[9/16]"
            )}
            style={{
                width: isExporting ? 1080 : undefined,
                height: isExporting ? 1920 : undefined,
                borderRadius: isExporting ? 0 : undefined,
                color: primaryColor // 核心强制注入
            }}
        >
            {/* 背景图片层 */}
            {hasBackgroundImage && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url("${encodeURI(backgroundImageUrl || '')}")`,
                            filter: 'brightness(0.92)'
                        }}
                    />
                    {/* 渐变遮罩层 - 增强文字可读性 */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)'
                        }}
                    />
                </>
            )}

            {!hasBackgroundImage && style.noise && <div className="absolute inset-0 opacity-[0.03] pointer-events-none contrast-150 brightness-100 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />}
            {!hasBackgroundImage && style.overlay && <div className={cn("absolute inset-0 pointer-events-none", style.overlay)} />}

            {/* 装饰元素 */}
            {!hasBackgroundImage && style.decorations?.map((d, i) => renderDecoration(d, i))}

            {renderContent()}
        </div>
    );
};

export default CardRenderer;
