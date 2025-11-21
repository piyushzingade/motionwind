export type Token = {
    className: string;
    css?: string;
    property?: string;
    value?: string | number;
    unit?: string;
    description?: string;
    group?: string;
};

// Small curated v1 token list
export const tokenList: Token[] = [
    // spacing (rem scale)
    { className: "p-0", property: "padding", value: 0, unit: "rem", description: "padding: 0", group: "spacing" },
    { className: "p-1", property: "padding", value: 0.25, unit: "rem", description: "padding: 0.25rem", group: "spacing" },
    { className: "p-2", property: "padding", value: 0.5, unit: "rem", description: "padding: 0.5rem", group: "spacing" },
    { className: "p-3", property: "padding", value: 0.75, unit: "rem", description: "padding: 0.75rem", group: "spacing" },
    { className: "p-4", property: "padding", value: 1, unit: "rem", description: "padding: 1rem", group: "spacing" },

    // margins
    { className: "m-0", property: "margin", value: 0, unit: "rem", group: "spacing" },
    { className: "m-1", property: "margin", value: 0.25, unit: "rem", group: "spacing" },
    { className: "m-2", property: "margin", value: 0.5, unit: "rem", group: "spacing" },
    { className: "m-3", property: "margin", value: 0.75, unit: "rem", group: "spacing" },
    { className: "m-4", property: "margin", value: 1, unit: "rem", group: "spacing" },

    // typography
    { className: "text-sm", property: "font-size", value: 0.875, unit: "rem", group: "typography" },
    { className: "text-base", property: "font-size", value: 1, unit: "rem", group: "typography" },
    { className: "text-lg", property: "font-size", value: 1.125, unit: "rem", group: "typography" },

    // layout
    { className: "block", css: "display:block", group: "layout" },
    { className: "inline-block", css: "display:inline-block", group: "layout" },
    { className: "flex", css: "display:flex", group: "layout" },
    { className: "grid", css: "display:grid", group: "layout" },
    { className: "items-center", css: "align-items:center", group: "layout" },
    { className: "justify-center", css: "justify-content:center", group: "layout" },

    // colors
    { className: "bg-black", css: "background-color:#000", group: "color" },
    { className: "bg-white", css: "background-color:#fff", group: "color" },
    { className: "text-black", css: "color:#000", group: "color" },
    { className: "text-white", css: "color:#fff", group: "color" },

    // opacity
    { className: "opacity-0", css: "opacity:0", group: "opacity" },
    { className: "opacity-50", css: "opacity:0.5", group: "opacity" },
    { className: "opacity-100", css: "opacity:1", group: "opacity" },

    // transforms (overwrite strategy - simple)
    { className: "translate-x-1", css: "transform: translateX(.25rem)", group: "transform" },
    { className: "translate-x-2", css: "transform: translateX(.5rem)", group: "transform" },
    { className: "translate-x-4", css: "transform: translateX(1rem)", group: "transform" },
    { className: "translate-x-8", css: "transform: translateX(2rem)", group: "transform" },

    { className: "scale-95", css: "transform: scale(.95)", group: "transform" },
    { className: "scale-100", css: "transform: scale(1)", group: "transform" },
    { className: "scale-105", css: "transform: scale(1.05)", group: "transform" },

    { className: "rotate-45", css: "transform: rotate(45deg)", group: "transform" },

    // border radius
    { className: "rounded-sm", css: "border-radius: .125rem", group: "radius" },
    { className: "rounded-md", css: "border-radius: .375rem", group: "radius" },
    { className: "rounded-lg", css: "border-radius: .5rem", group: "radius" },

    // helpers
    { className: "transition", css: "transition: all .15s ease", group: "helper" },
    { className: "will-change-transform", css: "will-change: transform", group: "helper" }
];
