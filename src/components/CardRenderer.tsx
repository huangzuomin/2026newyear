"use client";

import React from 'react';
import { cn, fitTextStyle, truncateText } from '@/lib/utils';
import { STYLE_MAP, StyleElements } from '@/config/elements';
import { TEMPLATES, getT01BackgroundImage, getT02BackgroundImage, getT03BackgroundImage, getT04BackgroundImage } from '@/config/templates';
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

export const CardRenderer: React.FC<CardRendererProps> = ({ tpl, params, styleOverride, isExporting, isThumbnail }) => {
    const baseStyle = STYLE_MAP[params.style] || STYLE_MAP[params.tone] || STYLE_MAP['clear'];
    const style = styleOverride || baseStyle;

    // 基础缩放因子
    const scale = isExporting ? 3 : 1;
    const padding = isThumbnail ? 16 : (28 * scale);

    const getPrimaryColor = () => {
        if (tpl === 'T01' || tpl === 'T02' || tpl === 'T03' || tpl === 'T04') {
            // 这类带图模板强制文字为白色或根据逻辑反差，这里暂时以配置或白色为主
            return '#FFFFFF';
        }
        const hexMatch = style.textPrimary.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
        return hexMatch ? hexMatch[0] : '#000000';
    };

    const getSecondaryColor = () => {
        const hexMatch = style.textSecondary.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
        return hexMatch ? hexMatch[0] : '#666666';
    };

    const primaryColor = getPrimaryColor();
    const secondaryColor = getSecondaryColor();

    // 确定是否具有背景图片
    const currentTemplate = TEMPLATES.find(t => t.id === tpl);
    const hasBackgroundImage = tpl === 'T01' || tpl === 'T02' || tpl === 'T03' || tpl === 'T04' || !!currentTemplate?.backgroundImage;

    const getBackgroundImage = () => {
        if (tpl === 'T01') return getT01BackgroundImage(params.tone || 'clear', params.style || 'modern');
        if (tpl === 'T02') return getT02BackgroundImage(params.tone || 'warm', params.style || 'minimal');
        if (tpl === 'T03') return getT03BackgroundImage(params.tone || 'warm', params.style || 'minimal');
        if (tpl === 'T04') return getT04BackgroundImage(params.landmark_id || 'wenzhou');
        return currentTemplate?.backgroundImage;
    };

    const backgroundImageUrl = getBackgroundImage();

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
                                        color: 'rgba(255, 255, 255, 0.08)',
                                        mixBlendMode: 'soft-light',
                                        opacity: 1
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
                                color: '#FFFFFF',
                                lineHeight: 1.15,
                                textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                            }}>
                                {truncateText(topic, isThumbnail ? 12 : 40)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {params.signature && !isThumbnail && (
                                <div className="text-right font-serif italic opacity-90"
                                    style={{
                                        fontSize: 18 * scale,
                                        color: '#FFFFFF',
                                        textShadow: '0 1px 8px rgba(0,0,0,0.3)'
                                    }}>
                                    —— {params.signature}
                                </div>
                            )}
                            {!isThumbnail && (
                                <div className="flex items-end justify-between pt-6">
                                    <div className="space-y-3">
                                        <div className="h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent rounded-full"
                                            style={{ width: 80 * scale, boxShadow: '0 1px 2px rgba(255,255,255,0.1)' }} />
                                        <div className="space-y-1">
                                            <p className="font-bold tracking-wide text-white"
                                                style={{
                                                    fontSize: 11 * scale,
                                                    letterSpacing: '0.12em',
                                                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                                    fontWeight: 600
                                                }}>
                                                温州市新闻传媒中心
                                            </p>
                                            <p className="uppercase tracking-[0.25em] text-white/50 font-medium"
                                                style={{
                                                    fontSize: 7 * scale,
                                                    letterSpacing: '0.28em'
                                                }}>
                                                WENZHOU MEDIA CENTER
                                            </p>
                                        </div>
                                        <p className="text-white/40 font-medium tracking-wide"
                                            style={{ fontSize: 8 * scale, letterSpacing: '0.08em' }}>
                                            扫码开启我的新年
                                        </p>
                                    </div>
                                    <div className="p-1 bg-white rounded-lg shadow-lg">
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
                    <div className="flex flex-col h-full justify-between relative z-10" style={{ padding }}>
                        <div className="space-y-4">
                            {!isThumbnail && (
                                <div className="font-black tracking-tighter leading-none select-none"
                                    style={{
                                        fontSize: 100 * scale,
                                        color: 'rgba(255, 255, 255, 0.08)',
                                        mixBlendMode: 'soft-light',
                                        opacity: 1
                                    }}>
                                    RECAP
                                </div>
                            )}
                            <div className="space-y-12" style={{ marginTop: isThumbnail ? 0 : -20 * scale }}>
                                <div className="space-y-3">
                                    <p className="uppercase tracking-[0.3em] font-bold text-white/60" style={{ fontSize: 10 * scale }}>2025 Learned</p>
                                    <p className="font-bold leading-snug tracking-tight text-balance text-white"
                                        style={{
                                            fontSize: (isThumbnail ? 15 : 32) * scale,
                                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                        }}>
                                        {learned}
                                    </p>
                                </div>
                                <div className="w-12 h-px rounded-full bg-white/20" />
                                <div className="space-y-3">
                                    <p className="uppercase tracking-[0.3em] font-bold text-white/60" style={{ fontSize: 10 * scale }}>2026 Action</p>
                                    <p className="font-bold leading-snug tracking-tight text-balance text-white"
                                        style={{
                                            fontSize: (isThumbnail ? 15 : 32) * scale,
                                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                        }}>
                                        {action}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!isThumbnail && (
                            <div className="flex items-end justify-between pt-6 border-t border-white/10">
                                <div className="space-y-3">
                                    <div className="h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent rounded-full"
                                        style={{ width: 80 * scale }} />
                                    <div className="space-y-1">
                                        <p className="font-bold tracking-wide text-white" style={{ fontSize: 11 * scale, letterSpacing: '0.12em' }}>
                                            温州市新闻传媒中心
                                        </p>
                                        <p className="uppercase tracking-[0.25em] text-white/50 font-medium" style={{ fontSize: 7 * scale }}>
                                            WENZHOU MEDIA CENTER
                                        </p>
                                    </div>
                                    <p className="text-white/40 font-medium tracking-wide" style={{ fontSize: 8 * scale }}>
                                        扫码开启我的新年
                                    </p>
                                </div>
                                <div className="p-1 bg-white rounded-lg shadow-lg">
                                    <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={46 * scale} />
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
                    <div className="flex flex-col h-full justify-between relative z-10" style={{ padding }}>
                        <div className="space-y-4">
                            {!isThumbnail && (
                                <div className="font-black tracking-tighter leading-none select-none"
                                    style={{
                                        fontSize: 110 * scale,
                                        color: 'rgba(255, 255, 255, 0.08)',
                                        mixBlendMode: 'soft-light'
                                    }}>
                                    ROLE
                                </div>
                            )}
                            <div className="flex flex-col items-center text-center space-y-8" style={{ marginTop: isThumbnail ? 0 : -10 * scale }}>
                                <div className="space-y-2">
                                    <span className="uppercase tracking-[0.4em] font-bold text-white/60" style={{ fontSize: 10 * scale }}>2026 Identity</span>
                                    <div className="w-8 h-px bg-white/20 mx-auto" />
                                </div>
                                <h2 className="font-black tracking-widest leading-tight text-white"
                                    style={{
                                        fontSize: (isThumbnail ? 22 : 52) * scale,
                                        textShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                    }}>
                                    {roleName}
                                </h2>
                                {!isThumbnail && (
                                    <p className="text-white/70 italic max-w-[85%] leading-relaxed font-serif" style={{ fontSize: 15 * scale }}>
                                        {role.desc}
                                    </p>
                                )}
                            </div>
                        </div>

                        {!isThumbnail && (
                            <div className="flex items-end justify-between pt-6 border-t border-white/10">
                                <div className="space-y-3">
                                    <div className="h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent rounded-full"
                                        style={{ width: 80 * scale }} />
                                    <div className="space-y-1">
                                        <p className="font-bold tracking-wide text-white" style={{ fontSize: 11 * scale }}>温州市新闻传媒中心</p>
                                        <p className="uppercase tracking-[0.25em] text-white/50 font-medium" style={{ fontSize: 7 * scale }}>WENZHOU MEDIA CENTER</p>
                                    </div>
                                    <p className="text-white/40 font-medium tracking-wide" style={{ fontSize: 8 * scale }}>扫码开启我的新年</p>
                                </div>
                                <div className="p-1 bg-white rounded-lg shadow-lg">
                                    <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={46 * scale} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            case 'T04': {
                const DEFAULT_QUOTES: Record<string, string> = {
                    '平安': '平安喜乐，万事胜意，岁岁常欢愉。',
                    '奋斗': '追风赶月莫停留，平芜尽处是春山。',
                    '重逢': '山水万程，皆是好运，久别终重逢。',
                    '热爱': '心有山海，静而无边，所求皆如愿。',
                    '自由': '心无挂碍，随风而行，自在如少年。',
                    '健康': '身心康泰，福寿绵长，无病亦无忧。',
                    '圆满': '月圆人圆，事事圆满，好景常相伴。',
                    '顺遂': '万事顺遂，岁岁平安，所行皆坦途。'
                };
                const quote = params._aiVariant || DEFAULT_QUOTES[params.theme] || '万事顺遂，岁岁平安';
                const recipient = params.recipient || '致自己';
                const signature = params.signature || '署名';
                const landmarkObj = TEMPLATES.find(t => t.id === 'T04')?.fields
                    .find(f => f.key === 'landmark_id')?.options
                    ?.find(o => o.value === params.landmark_id);
                const landmark = landmarkObj?.label || '温州';

                return (
                    <div className="flex flex-col h-full relative z-10" style={{ padding }}>
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                        <div className="pt-12 text-center relative">
                            <span className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium tracking-widest"
                                style={{ fontSize: 13 * scale }}>
                                致：{recipient}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center relative" style={{ paddingLeft: isThumbnail ? 4 : 32, paddingRight: isThumbnail ? 4 : 32 }}>
                            <div className="w-full text-center relative">
                                <span className="absolute -top-4 left-0 text-white/20 font-serif leading-none select-none" style={{ fontSize: (isThumbnail ? 40 : 80) * scale }}>“</span>
                                <h2 className="font-bold leading-relaxed tracking-[0.1em] text-white text-balance relative z-10 italic"
                                    style={{
                                        fontSize: (isThumbnail ? 16 : 38) * scale,
                                        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                                        fontFamily: 'serif',
                                        padding: isThumbnail ? '0 12px' : '0 24px'
                                    }}>
                                    {quote}
                                </h2>
                                <span className="absolute -bottom-8 right-0 text-white/20 font-serif leading-none select-none" style={{ fontSize: (isThumbnail ? 40 : 80) * scale }}>”</span>
                            </div>
                        </div>

                        <div className="pb-8 space-y-4 text-right pr-6 relative">
                            <div className="space-y-1">
                                <p className="text-white/60 font-medium tracking-widest uppercase" style={{ fontSize: 9 * scale }}>SIGNATURE</p>
                                <p className="text-white font-bold tracking-widest" style={{ fontSize: 18 * scale }}>— {signature}</p>
                            </div>
                            <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
                                <span className="text-white/80 font-medium tracking-[0.2em]" style={{ fontSize: 10 * scale }}>{landmark}</span>
                            </div>
                        </div>

                        {!isThumbnail && (
                            <div className="mt-auto flex items-end justify-between pt-6 border-t border-white/10 relative z-20">
                                <div className="space-y-3">
                                    <div className="h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent rounded-full"
                                        style={{ width: 80 * scale }} />
                                    <div className="space-y-1">
                                        <p className="font-bold tracking-wide text-white" style={{ fontSize: 11 * scale }}>温州市新闻传媒中心</p>
                                        <p className="uppercase tracking-[0.25em] text-white/50 font-medium" style={{ fontSize: 7 * scale }}>WENZHOU MEDIA CENTER</p>
                                    </div>
                                    <p className="text-white/40 font-medium tracking-wide" style={{ fontSize: 8 * scale }}>扫码开启我的新年</p>
                                </div>
                                <div className="p-1 bg-white rounded-lg shadow-xl">
                                    <QRCodeBlock url={params._shareUrl || 'https://2026-card.example.com'} size={46 * scale} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            default:
                return (
                    <div className="flex items-center justify-center h-full text-white/40 font-medium" style={{ padding }}>
                        未选择模板
                    </div>
                );
        }
    };

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
                color: primaryColor
            }}
        >
            {/* 背景图片层 */}
            {hasBackgroundImage && backgroundImageUrl && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url("${encodeURI(backgroundImageUrl)}")`,
                            filter: 'brightness(0.92)'
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)'
                        }}
                    />
                </>
            )}

            {!hasBackgroundImage && style.noise && <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />}
            {!hasBackgroundImage && style.overlay && <div className={cn("absolute inset-0 pointer-events-none", style.overlay)} />}
            {!hasBackgroundImage && style.decorations?.map((d, i) => renderDecoration(d, i))}

            {renderContent()}
        </div>
    );
};

export default CardRenderer;
