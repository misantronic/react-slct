export function toString(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value && typeof value === 'object') {
        if (value.toJSON) {
            value = value.toJSON();
        }
    }
    return JSON.stringify(value);
}
export function isArray(val) {
    if (Array.isArray(val)) {
        return true;
    }
    // this is just a workaround for potential observable arrays
    if (val && val.map) {
        return true;
    }
    return false;
}
export function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return undefined;
}
export function getWindow() {
    if (typeof window !== 'undefined') {
        return window;
    }
    return undefined;
}
export function getWindowInnerHeight(defaultHeight = 700) {
    const window = getWindow();
    if (window) {
        return window.innerHeight;
    }
    return defaultHeight;
}
export const keys = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27
};
//# sourceMappingURL=utils.js.map