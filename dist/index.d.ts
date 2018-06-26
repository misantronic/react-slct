/// <reference types="react" />
import * as React from 'react';
import { SelectProps, SelectState } from './typings';
export declare class Select2 extends React.PureComponent<SelectProps, SelectState> {
    private static Container;
    private static NativeSelect;
    private nativeSelect;
    private container;
    private rect;
    constructor(props: SelectProps);
    private readonly options;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private renderNativeSelect();
    private toggleMenu();
    private openMenu();
    private closeMenu(callback?);
    private addDocumentListener();
    private removeDocumentListener();
    private onChangeNativeSelect(e);
    private onSearchFocus();
    private onOptionSelect(value);
    private onOptionRemove(value);
    private onClear();
    private onSearch(search);
    private onDocumentClick();
    private onKeyDown({keyCode});
    private onKeyUp({keyCode});
}
