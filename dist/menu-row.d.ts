import * as React from 'react';
import { CSSProperties } from 'react';
import { MenuComponentProps } from './typings';
interface MenuRowProps {
    index: number;
    style: CSSProperties;
    equalCompareProp?: string | null;
    data: MenuComponentProps;
}
export declare const MenuRow: React.MemoExoticComponent<({ index, style, data }: MenuRowProps) => React.JSX.Element>;
export {};
