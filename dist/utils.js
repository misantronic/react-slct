"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toKey(value, equalCompareProp = 'id') {
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
exports.toKey = toKey;
function equal(valueA, valueB, equalCompareProp = 'id') {
    if (valueA === valueB) {
        return true;
    }
    if (!valueA || !valueB) {
        return false;
    }
    if (typeof valueA === 'object' && typeof valueB === 'object') {
        if (equalCompareProp &&
            valueA[equalCompareProp] !== undefined &&
            valueA[equalCompareProp] !== null &&
            valueB[equalCompareProp] !== undefined &&
            valueB[equalCompareProp] !== null &&
            valueA[equalCompareProp] === valueB[equalCompareProp]) {
            return true;
        }
        if (valueA.toJSON && valueB.toJSON) {
            return (JSON.stringify(valueA.toJSON()) ===
                JSON.stringify(valueB.toJSON()));
        }
        return JSON.stringify(valueA) === JSON.stringify(valueB);
    }
    return false;
}
exports.equal = equal;
function getValueOptions(options, value, multi, equalCompareProp) {
    return options.filter(option => {
        if (isArray(value) && multi) {
            return value.some(val => equal(option.value, val, equalCompareProp));
        }
        else {
            return equal(option.value, value, equalCompareProp);
        }
    });
}
exports.getValueOptions = getValueOptions;
function isArray(val) {
    if (Array.isArray(val)) {
        return true;
    }
    // this is just a workaround for potential observable arrays
    if (val && val.map) {
        return true;
    }
    return false;
}
exports.isArray = isArray;
function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return undefined;
}
exports.getDocument = getDocument;
function getWindow() {
    if (typeof window !== 'undefined') {
        return window;
    }
    return undefined;
}
exports.getWindow = getWindow;
function getWindowInnerHeight(defaultHeight = 700) {
    const window = getWindow();
    if (window) {
        return window.innerHeight;
    }
    return defaultHeight;
}
exports.getWindowInnerHeight = getWindowInnerHeight;
exports.keys = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    BACKSPACE: 8,
    SPACE: 32
};
//# sourceMappingURL=utils.js.map