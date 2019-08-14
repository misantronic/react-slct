import * as React from 'react';
import { CSSProperties } from 'react';
import { MenuComponentProps } from './typings';
interface MenuRowProps {
    index: number;
    style: CSSProperties;
    data: MenuComponentProps;
}
export declare const MenuRow: React.MemoExoticComponent<({ index, style, data }: MenuRowProps) => JSX.Element>;
export {};
