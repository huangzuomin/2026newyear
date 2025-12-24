"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Dice5, Wand2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { TEMPLATES } from '@/config/templates';
import topics from '@/config/topics.json';
import roles from '@/config/roles.json';
import CardRenderer from '@/components/CardRenderer';
import CandidateGrid from '@/components/CandidateGrid';
import { validateInput } from '@/lib/validator';
import { storage } from '@/lib/storage';
import { buildShareUrl } from '@/lib/utils';

export default function CreateCardClient() {
    const router = useRouter();
    const { tpl: tplId } = useParams() as { tpl: string };
    const searchParams = useSearchParams();
    const config = TEMPLATES.find(t => t.id === tplId);

    const [params, setParams] = useState<Record<string, any>>({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [variants, setVariants] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // 初始化参数：URL -> Draft -> Defaults
    useEffect(() => {
        if (!config) return;

        const initialParams: Record<string, any> = { ...config.defaultParams };

        let restoredStyleIndex = 0;
        let restoredAiText = '';

        searchParams.forEach((value, key) => {
            if (key === 'styleIndex') {
                restoredStyleIndex = parseInt(value);
                setSelectedIndex(restoredStyleIndex);
            } else if (key === '_aiVariant') {
                restoredAiText = value;
            } else {
                initialParams[key] = value;
            }
        });

        if (restoredAiText && restoredStyleIndex > 0) {
            const v = ['', '', ''];
            v[restoredStyleIndex] = restoredAiText;
            setVariants(v);
        }

        // 尝试从 Draft 恢复 (如果 URL 没有参数)
        if (searchParams.size === 0) {
            const draft = storage.loadDraft();
            if (draft && draft.tpl === tplId) {
                Object.assign(initialParams, draft.params);
            }
        }

        setParams(initialParams);
    }, [tplId, config, searchParams]);

    // 自动保存草稿
    useEffect(() => {
        if (Object.keys(params).length > 0) {
            storage.saveDraft(tplId, params);
        }
    }, [params, tplId]);

    // AI 变体逻辑
    useEffect(() => {
        const fetchVariants = async () => {
            const baseText = tplId === 'T01'
                ? (topics.find(t => t.id === params.topic_id)?.text || "")
                : tplId === 'T02'
                    ? `${params.learned} / ${params.try}`
                    : (roles.find(r => r.id === params.role_id)?.name || "");

            if (!baseText || baseText.length < 2) return;

            setIsGenerating(true);
            try {
                const res = await fetch('/api/variant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: baseText,
                        tone: params.tone || 'clear',
                        tpl: tplId
                    })
                });
                const data = await res.json();
                if (data.variants) {
                    setVariants([baseText, ...data.variants.slice(0, 2)]);
                }
            } catch (err) {
                console.error('Failed to fetch AI variants:', err);
                setVariants([baseText, baseText, baseText]);
            } finally {
                setIsGenerating(false);
            }
        };

        const timer = setTimeout(fetchVariants, 1000);
        return () => clearTimeout(timer);
    }, [params.topic_id, params.role_id, params.learned, params.try, params.tone, tplId]);

    const handleParamChange = (key: string, value: string) => {
        const validation = validateInput(value);
        if (!validation.success) {
            setError(validation.message || "输入不合法");
            return;
        }
        setError(null);
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const handleRandom = () => {
        if (!config) return;
        const newParams = { ...params };
        if (tplId === 'T01') {
            newParams.topic_id = topics[Math.floor(Math.random() * topics.length)].id;
            newParams.tone = ['warm', 'calm', 'clear', 'firm'][Math.floor(Math.random() * 4)];
            newParams.style = ['minimal', 'modern', 'guofeng'][Math.floor(Math.random() * 3)];
        } else if (tplId === 'T02') {
            newParams.tone = Math.random() > 0.5 ? 'warm' : 'calm';
        } else if (tplId === 'T03') {
            newParams.role_id = roles[Math.floor(Math.random() * roles.length)].id;
        }
        setParams(newParams);
        setSelectedIndex(Math.floor(Math.random() * 3));
    };

    const handleComplete = () => {
        const finalVariant = selectedIndex === 0 ? '' : (variants[selectedIndex] || '');
        const shareParams = {
            ...params,
            styleIndex: selectedIndex.toString(),
            _aiVariant: finalVariant
        };
        const shareUrl = buildShareUrl(typeof window !== 'undefined' ? window.location.origin : '', tplId, shareParams);

        const resultParams = new URLSearchParams({
            tpl: tplId,
            ...params,
            styleIndex: selectedIndex.toString(),
            _aiVariant: finalVariant,
            _shareUrl: shareUrl
        });
        router.push(`/result?${resultParams.toString()}`);
    };

    if (!config) return <div>Template not found.</div>;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-6 h-16 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <Link href="/" className="p-2 -ml-2 text-gray-400">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-lg font-bold">{config.name}</h1>
                <button
                    onClick={handleRandom}
                    className="p-2 -mr-2 text-brand-500 active:rotate-180 transition-transform duration-500"
                >
                    <Dice5 size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full">
                <div className="w-full md:w-1/2 p-6 space-y-8">
                    <div className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        {config.fields.map(field => (
                            <div key={field.key} className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 block">{field.label}</label>
                                {field.type === 'select' ? (
                                    <select
                                        value={params[field.key] || ''}
                                        onChange={(e) => handleParamChange(field.key, e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none"
                                    >
                                        {field.key === 'topic_id' && topics.map(t => <option key={t.id} value={t.id}>{t.text}</option>)}
                                        {field.key === 'role_id' && roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={params[field.key] || ''}
                                        onChange={(e) => handleParamChange(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        maxLength={field.maxLength}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                    />
                                )}
                            </div>
                        ))}

                        {error && (
                            <div className="flex items-center text-red-500 text-xs gap-1 py-2">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}
                    </div>

                    <CandidateGrid
                        tpl={tplId}
                        params={params}
                        variants={variants}
                        isGenerating={isGenerating}
                        selectedIndex={selectedIndex}
                        onSelect={setSelectedIndex}
                    />

                    <button
                        onClick={handleComplete}
                        className="w-full h-14 bg-brand-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center"
                    >
                        <Wand2 className="mr-2" size={20} />
                        确认样式，生成大图
                    </button>
                </div>

                <div className="w-full md:w-1/2 p-6 md:sticky md:top-16 h-fit bg-gray-100/50 md:bg-transparent rounded-t-[3rem] md:rounded-none">
                    <div className="p-4 bg-white/50 backdrop-blur-xl rounded-[2.5rem] shadow-inner">
                        <CardRenderer
                            tpl={tplId}
                            params={{
                                ...params,
                                _shareUrl: buildShareUrl(typeof window !== 'undefined' ? window.location.origin : '', tplId, params),
                                _aiVariant: selectedIndex === 0 ? undefined : variants[selectedIndex]
                            }}
                        />
                        <p className="mt-4 text-center text-xs text-gray-400 font-medium">✨ 实时预览：你的 2026 开场时刻</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
