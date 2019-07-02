import { Option } from '.';

export function toKey(value: any): string | number {
    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        if (value.id) {
            return value.id;
        }

        if (value.toJSON) {
            return value.toJSON();
        }
    }

    return JSON.stringify(value);
}

export function equal(valueA: any, valueB: any) {
    if (valueA === valueB) {
        return true;
    }

    if (!valueA || !valueB) {
        return false;
    }

    if (typeof valueA === 'object' && typeof valueB === 'object') {
        if (
            valueA.id !== undefined &&
            valueA.id !== null &&
            valueB.id !== undefined &&
            valueB.id !== null &&
            valueA.id === valueB.id
        ) {
            return true;
        }

        if (valueA.toJSON && valueB.toJSON) {
            return (
                JSON.stringify(valueA.toJSON()) ===
                JSON.stringify(valueB.toJSON())
            );
        }

        return JSON.stringify(valueA) === JSON.stringify(valueB);
    }

    return false;
}

export function getValueOptions(options: Option[], value: any) {
    return options.filter(option => {
        if (isArray(value)) {
            return value.some(val => equal(option.value, val));
        } else {
            return equal(option.value, value);
        }
    });
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

export function getDocument(): Document | undefined {
    if (typeof document !== 'undefined') {
        return document;
    }

    return undefined;
}

export function getWindow(): Window | undefined {
    if (typeof window !== 'undefined') {
        return window;
    }

    return undefined;
}

export function getWindowInnerHeight(defaultHeight = 700): number {
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
    ESC: 27,
    BACKSPACE: 8,
    SPACE: 32
};
