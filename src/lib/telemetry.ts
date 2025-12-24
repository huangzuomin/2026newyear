"use client";

/**
 * 轻量级埋点占位符
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    console.log(`[Telemetry] ${eventName}`, properties);
    // 在这里可以集成 Google Analytics, Plausible, Mixpanel 等
};

export const EVENTS = {
    PAGE_VIEW: 'page_view',
    TEMPLATE_SELECT: 'template_select',
    CARD_GENERATE: 'card_generate',
    CARD_EXPORT: 'card_export',
    SHARE_COPY_LINK: 'share_copy_link',
    SHARE_COPY_TEXT: 'share_copy_text',
};
