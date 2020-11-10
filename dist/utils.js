"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = exports.getWindowInnerHeight = exports.getWindow = exports.getDocument = exports.isArray = exports.getValueOptions = exports.replaceUmlauts = exports.equal = exports.toKey = void 0;
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
function replaceUmlauts(str) {
    return str
        .replace('Ü', 'u')
        .replace('Ö', 'o')
        .replace('Ä', 'a')
        .replace('ü', 'u')
        .replace('ä', 'a')
        .replace('ö', 'o');
}
exports.replaceUmlauts = replaceUmlauts;
function getValueOptions(options, value, multi, equalCompareProp) {
    return options
        .slice()
        .filter((option) => {
        if (isArray(value) && multi) {
            return value.some((val) => equal(option.value, val, equalCompareProp));
        }
        else {
            return equal(option.value, value, equalCompareProp);
        }
    })
        .sort((optionA, optionB) => {
        if (isArray(value) && multi) {
            const a = value.findIndex((val) => equal(optionA.value, val, equalCompareProp));
            const b = value.findIndex((val) => equal(optionB.value, val, equalCompareProp));
            return a < b ? -1 : a > b ? 1 : 0;
        }
        else {
            return 0;
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
    var _a, _b;
    const window = getWindow();
    if (window) {
        return (_b = (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : window.innerHeight;
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