import { Option } from '.';

export function toKey(
    value: any,
    equalCompareProp: string | null = 'id'
): string | number {
    if (typeof value === 'string') {
        return value;
    }

    if (value && typeof value === 'object') {
        const jsonObject = value.toJSON ? value.toJSON() : value;

        if (equalCompareProp && jsonObject[equalCompareProp]) {
            return jsonObject[equalCompareProp];
        }

        return JSON.stringify(jsonObject);
    }

    return JSON.stringify(value);
}

export function equal(
    valueA: any,
    valueB: any,
    equalCompareProp: string | null = 'id',
    strict = false
) {
    if (valueA === valueB) {
        return true;
    }

    if (!valueA || !valueB) {
        return false;
    }

    if (typeof valueA === 'object' && typeof valueB === 'object') {
        if (
            equalCompareProp &&
            valueA[equalCompareProp] !== undefined &&
            valueA[equalCompareProp] !== null &&
            valueB[equalCompareProp] !== undefined &&
            valueB[equalCompareProp] !== null &&
            valueA[equalCompareProp] === valueB[equalCompareProp]
        ) {
            return true;
        }

        if (strict) {
            return false;
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

export function replaceUmlauts(str: string) {
    return str
        .replace('Ü', 'u')
        .replace('Ö', 'o')
        .replace('Ä', 'a')
        .replace('ü', 'u')
        .replace('ä', 'a')
        .replace('ö', 'o');
}

export function getValueOptions(
    options: Option[],
    value: any,
    multi: boolean | undefined,
    equalCompareProp?: string | null,
    strict = false
) {
    return options
        .slice()
        .filter((option) => {
            if (isArray(value) && multi) {
                return value.some((val) =>
                    equal(option.value, val, equalCompareProp, strict)
                );
            } else {
                return equal(option.value, value, equalCompareProp, strict);
            }
        })
        .sort((optionA, optionB) => {
            if (isArray(value) && multi) {
                const a = value.findIndex((val) =>
                    equal(optionA.value, val, equalCompareProp, strict)
                );
                const b = value.findIndex((val) =>
                    equal(optionB.value, val, equalCompareProp, strict)
                );

                return a < b ? -1 : a > b ? 1 : 0;
            } else {
                return 0;
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
        return window.visualViewport?.height ?? window.innerHeight;
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
