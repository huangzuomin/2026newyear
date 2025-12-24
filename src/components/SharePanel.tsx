"use client";

import React, { useState } from 'react';
import { Copy, Link as LinkIcon, Check, MessageCircle } from 'lucide-react';
import { buildShareCopy } from '@/config/shareCopy';
import { cn } from '@/lib/utils';

interface Props {
    tplName: string;
    shareUrl: string;
}

const SharePanel: React.FC<Props> = ({ tplName, shareUrl }) => {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCopy, setCopiedCopy] = useState(false);

    const copyToClipboard = async (text: string, setStatus: (v: boolean) => void) => {
        try {
            await navigator.clipboard.writeText(text);
            setStatus(true);
            setTimeout(() => setStatus(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const shareText = buildShareCopy(tplName, shareUrl);

    return (
        <div className="grid grid-cols-2 gap-3 w-full">
            <button
                onClick={() => copyToClipboard(shareUrl, setCopiedLink)}
                className={cn(
                    "flex items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium transition-all",
                    copiedLink ? "text-green-600 bg-green-50 border-green-200" : "text-gray-700 active:bg-gray-50"
                )}
            >
                {copiedLink ? <Check size={18} className="mr-2" /> : <LinkIcon size={18} className="mr-2" />}
                复制链接
            </button>
            <button
                onClick={() => copyToClipboard(shareText, setCopiedCopy)}
                className={cn(
                    "flex items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium transition-all font-display",
                    copiedCopy ? "text-green-600 bg-green-50 border-green-200" : "text-gray-700 active:bg-gray-50"
                )}
            >
                {copiedCopy ? <Check size={18} className="mr-2" /> : <MessageCircle size={18} className="mr-2" />}
                复制分享文案
            </button>
        </div>
    );
};

export default SharePanel;
