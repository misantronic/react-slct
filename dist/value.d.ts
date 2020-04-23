import * as React from 'react';
import { SelectProps } from './typings';
export interface ValueProps {
    options: SelectProps['options'];
    value: SelectProps['value'];
    placeholder: SelectProps['placeholder'];
    clearable: SelectProps['clearable'];
    searchable: SelectProps['searchable'];
    labelComponent: SelectProps['labelComponent'];
    valueComponentSingle: SelectProps['valueComponentSingle'];
    valueComponentMulti: SelectProps['valueComponentMulti'];
    arrowComponent: SelectProps['arrowComponent'];
    clearComponent: SelectProps['clearComponent'];
    valueIconComponent: SelectProps['valueIconComponent'];
    multi: SelectProps['multi'];
    mobile: SelectProps['native'];
    disabled: SelectProps['disabled'];
    error: SelectProps['error'];
    equalCompareProp: SelectProps['equalCompareProp'];
    search?: string;
    keepSearchOnBlur?: boolean;
    open: boolean;
    focused?: boolean;
    onClear(): void;
    onClick(): void;
    onSearch(search: string): void;
    onSearchFocus(): void;
    onSearchBlur(): void;
    onOptionRemove(value: any): void;
}
export declare class Value extends React.PureComponent<ValueProps> {
    search: React.RefObject<HTMLSpanElement>;
    constructor(props: ValueProps);
    componentDidUpdate(prevProps: ValueProps): void;
    render(): React.ReactNode;
    private renderSearch;
    private renderValues;
    private focus;
    private blur;
    private onClick;
    private onClear;
    private onSearch;
    private onKeyDown;
}
