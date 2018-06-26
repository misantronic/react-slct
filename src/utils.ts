export function toString(value: any): string {
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

export function isArray<T = any>(val: any): val is Array<T> {
    if (Array.isArray(val)) {
        return true;
    }

    // this is just a workaround for potential observable arrays
    if (val && val.map) {
        return true;
    }

    return false;
}

export const keys = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27
};
