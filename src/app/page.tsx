import Link from 'next/link';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { TEMPLATES } from '@/config/templates';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#fafafc] relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />

            <div className="max-w-md mx-auto px-6 py-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
                        <Sparkles size={12} className="mr-2" /> 2026 Opening
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
                        元旦 · 我的<br /><span className="text-brand-600 italic">2026 开场卡</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        选一个模板，立一个 Flag。<br />生成你的跨年仪式感。
                    </p>
                </header>

                <div className="space-y-6">
                    {TEMPLATES.map((tpl) => (
                        <Link
                            key={tpl.id}
                            href={`/create/${tpl.id}`}
                            className="group block bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{tpl.id}</span>
                                <ArrowRight className="text-gray-300 group-hover:text-brand-500 transition-colors" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{tpl.name}</h2>
                            <p className="text-sm text-gray-400">
                                {tpl.id === 'T01' && '保持真实，自由表达。'}
                                {tpl.id === 'T02' && '复盘过去，开启未来。'}
                                {tpl.id === 'T03' && '发现新一年的隐藏身份。'}
                            </p>
                        </Link>
                    ))}
                </div>

                <footer className="mt-16 text-center text-[10px] text-gray-300 uppercase tracking-[0.2em] font-bold">
                    Design by Your Project Team © 2026
                </footer>
            </div>
        </main>
    );
}
