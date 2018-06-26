import * as React from 'react';
import { SelectProps, SelectState, Option } from './typings';
export { SelectProps, Option };
export declare class Select extends React.PureComponent<SelectProps, SelectState> {
    private static Container;
    private static NativeSelect;
    private nativeSelect;
    private container;
    private rect;
    constructor(props: SelectProps);
    private readonly options;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private renderNativeSelect;
    private toggleMenu;
    private openMenu;
    private closeMenu;
    private addDocumentListener;
    private removeDocumentListener;
    private onChangeNativeSelect;
    private onSearchFocus;
    private onOptionSelect;
    private onOptionRemove;
    private onClear;
    private onSearch;
    private onDocumentClick;
    private onKeyDown;
    private onKeyUp;
}
