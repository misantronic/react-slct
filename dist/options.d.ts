/// <reference types="react" />
import * as React from 'react';
import { SelectProps, Rect } from './typings';
export interface OptionsProps<T = any> {
    options: SelectProps['options'];
    value: SelectProps['value'];
    labelComponent: SelectProps['labelComponent'];
    multi: SelectProps['multi'];
    selectedIndex?: number;
    open: boolean;
    rect: Rect;
    search?: string;
    onSelect(value: T | T[]): void;
}
export declare class Options extends React.PureComponent<OptionsProps> {
    private static OptionsContainer;
    private static Empty;
    private list;
    constructor(props: any);
    componentDidUpdate(prevProps: OptionsProps): void;
    render(): React.ReactNode;
    private rowRenderer({key, index, style});
    private onSelect(value);
}
