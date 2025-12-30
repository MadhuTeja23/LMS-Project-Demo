import React, { useRef, useEffect, useState } from "react";
import Draggable from "./Draggable";
import Typewriter from "./Typewriter";

const PAGE_SIZE = {
    A4: {
        landscape: { w: 1123, h: 794 },
        portrait: { w: 794, h: 1123 }
    }
};

const WatermarkOverlay = ({ text, opacity = 0.1 }) => (
    <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '80px',
        fontWeight: 'bold',
        color: '#000',
        opacity: opacity,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 1,
        userSelect: 'none'
    }}>
        {text}
    </div>
);

const BorderPresetOverlay = ({ preset, color }) => {
    const styleBase = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 };
    if (preset === 'simple') return <div style={{ ...styleBase, border: `20px solid ${color}` }} />;
    if (preset === 'fancy') return <div style={{ ...styleBase, border: `4px double ${color}`, outline: `2px solid ${color}`, outlineOffset: '-15px' }} />;
    if (preset === 'modern') return <div style={{ ...styleBase, borderTop: `40px solid ${color}`, borderBottom: `40px solid ${color}` }} />;
    return null;
};

const CertificateRenderer = ({
    template,
    data,
    isDesigning = false,
    scale: fixedScale,
    onUpdateTemplate,
    onSelectElement,
    selectedId
}) => {
    if (!template) return null;

    const { page, theme, elements } = template;
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    const { w, h } = PAGE_SIZE[page.type][page.orientation];

    // Scale calculation
    useEffect(() => {
        if (fixedScale) {
            setScale(fixedScale);
            return;
        }
        const resize = () => {
            if (containerRef.current) {
                // Calculate scale to fit container with some padding, but max 1 (don't zoom in)
                const containerWidth = containerRef.current.clientWidth;
                const computedScale = Math.min(1, (containerWidth - 40) / w); // 40px padding buffer
                setScale(computedScale > 0 ? computedScale : 1);
            }
        };
        resize();
        window.addEventListener('resize', resize); // Ensure window resize triggers it too
        const ro = new ResizeObserver(resize);
        ro.observe(containerRef.current);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, [fixedScale, w]);

    const updateElement = (id, patch) => {
        if (!onUpdateTemplate) return;
        onUpdateTemplate({
            ...template,
            elements: elements.map(el =>
                el.id === id ? { ...el, ...patch } : el
            )
        });
    };

    // ... (Custom HTML block omitted for brevity, assuming unchanged) ...

    // Watermark & Border components (omitted, assuming unchanged)

    // Standard JSON Elements Mode
    return (
        <div
            ref={containerRef}
            className="certificate-preview-wrapper"
            style={{
                width: "100%",
                background: "#e2e8f0",
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                overflow: "auto",
                minHeight: h * scale + 60 // Ensure container has height for the transformed content
            }}
        >
            <div
                style={{
                    width: w,
                    height: h,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    position: "relative",
                    background: theme.backgroundImage
                        ? `url(${theme.backgroundImage})`
                        : "#fff",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    fontFamily: theme.fontFamily,
                    color: theme.textColor,
                    // Basic fallback border if no preset is active, or user custom simple border
                    border: !theme.borderPreset ? `${theme.borderWidth || 0}px ${theme.borderStyle || 'solid'} ${theme.borderColor || '#000'}` : 'none',
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    flexShrink: 0
                }}
            >
                {/* Internal Border Presets */}
                {theme.borderPreset && <BorderPresetOverlay preset={theme.borderPreset} color={theme.borderColor || '#000'} />}

                {theme.borderImage && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${theme.borderImage})`,
                            backgroundSize: "100% 100%",
                            pointerEvents: "none",
                            zIndex: 10 // Borders usually top
                        }}
                    />
                )}

                {/* CSS Watermark Overlay */}
                {theme.showWatermark && <WatermarkOverlay text={theme.watermarkText || 'CONFIDENTIAL'} opacity={theme.watermarkOpacity} />}

                {/* Logo Watermark Overlay */}
                {theme.showLogoWatermark && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        height: '50%',
                        backgroundImage: `url(${localStorage.getItem('institute_logo')})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        opacity: theme.watermarkOpacity !== undefined ? theme.watermarkOpacity : 0.1,
                        zIndex: 1, // Same layer as text watermark
                        pointerEvents: 'none'
                    }} />
                )}

                {elements.map(el => (
                    <Draggable
                        key={el.id}
                        initialPos={{ x: el.x, y: el.y }}
                        initialSize={{ w: el.w, h: el.h }}
                        isEnabled={isDesigning}
                        resizable={isDesigning}
                        isSelected={selectedId === el.id}
                        onSelect={() => onSelectElement && onSelectElement(el.id)}
                        onDragEnd={pos => updateElement(el.id, pos)}
                        onResizeEnd={size => updateElement(el.id, size)}
                    >
                        {/* Content logic - Removed Typewriter, strict static text */}
                        {el.type === "text" && (
                            <div style={{ ...el.style, position: 'relative', zIndex: 20 }}>
                                {(el.content || "").replace(
                                    /{{(.*?)}}/g,
                                    (_, k) => data[k] || ""
                                )}
                            </div>
                        )}

                        {el.type === "image" && (
                            <img
                                src={el.src}
                                alt=""
                                crossOrigin="anonymous"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    opacity: el.style?.opacity !== undefined ? el.style.opacity : 1,
                                    position: 'relative',
                                    zIndex: 20
                                }}
                            />
                        )}
                    </Draggable>
                ))}
            </div>
        </div >
    );
};

export default CertificateRenderer;
