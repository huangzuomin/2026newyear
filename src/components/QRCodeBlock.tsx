"use client";

import React, { useEffect, useState, useMemo } from 'react';
import QRCode from 'qrcode';

interface Props {
    url: string;
    size?: number;
}

const QRCodeBlock: React.FC<Props> = ({ url, size = 120 }) => {
    const [dataUrl, setDataUrl] = useState<string>('');

    // 简单缓存
    const cacheKey = useMemo(() => url, [url]);

    useEffect(() => {
        let active = true;
        QRCode.toDataURL(url, {
            margin: 1,
            width: size,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        }).then(res => {
            if (active) setDataUrl(res);
        }).catch(err => {
            console.error("QR Code Error:", err);
        });
        return () => { active = false; };
    }, [cacheKey, size]);

    if (!dataUrl) return <div style={{ width: size, height: size }} className="bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">Loading...</div>;

    return (
        <div className="bg-white p-1 rounded shadow-sm">
            <img src={dataUrl} alt="同款入口二维码" width={size} height={size} className="block" />
        </div>
    );
};

export default React.memo(QRCodeBlock);
