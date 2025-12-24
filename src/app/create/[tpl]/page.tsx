import React, { Suspense } from 'react';
import { TEMPLATES } from '@/config/templates';
import CreateCardClient from '@/components/CreateCardClient';

// 静态导出必须：枚举所有可能的动态参数
// 此处必须是服务器端导出，不能包含 "use client"
export function generateStaticParams() {
    return TEMPLATES.map((t) => ({
        tpl: t.id,
    }));
}

export default function CreatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CreateCardClient />
        </Suspense>
    );
}
