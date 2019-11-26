import { Option } from '.';
export declare function toKey(value: any): string | number;
export declare function equal(valueA: any, valueB: any, equalCompareProp?: string | null): boolean;
export declare function getValueOptions(options: Option[], value: any, multi: boolean | undefined, equalCompareProp?: string | null): Option<any>[];
export declare function isArray<T = any>(val: any): val is Array<T>;
export declare function getDocument(): Document | undefined;
export declare function getWindow(): Window | undefined;
export declare function getWindowInnerHeight(defaultHeight?: number): number;
export declare const keys: {
    ARROW_UP: number;
    ARROW_DOWN: number;
    ENTER: number;
    TAB: number;
    ESC: number;
    BACKSPACE: number;
    SPACE: number;
};
