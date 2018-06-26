import * as React from 'react';
import { SelectProps } from './typings';
export interface ValueProps {
    options: SelectProps['options'];
    value: SelectProps['value'];
    placeholder: SelectProps['placeholder'];
    clearable: SelectProps['clearable'];
    searchable: SelectProps['searchable'];
    labelComponent: SelectProps['labelComponent'];
    multi: SelectProps['multi'];
    mobile: SelectProps['native'];
    search?: string;
    open: boolean;
    onClear(): void;
    onClick(): void;
    onSearch(search: string): void;
    onSearchFocus(): void;
    onOptionRemove(value: any): void;
}
export declare class Value extends React.PureComponent<ValueProps> {
    search: React.RefObject<HTMLSpanElement>;
    constructor(props: ValueProps);
    componentDidUpdate(prevProps: ValueProps): void;
    render(): React.ReactNode;
    private renderSearch;
    private renderValues;
    private onClick;
    private onClear;
    private onSearch;
    private onKeyDown;
}
