import * as React from 'react';
import { MenuComponentProps, Rect } from './typings';
interface MenuComponentState {
    rect?: Rect;
}
export declare class Menu extends React.PureComponent<MenuComponentProps, MenuComponentState> {
    private static EmptyOptionItem;
    private static Empty;
    private list;
    constructor(props: any);
    componentDidUpdate(prevProps: MenuComponentProps): void;
    render(): React.ReactNode;
    private rowRenderer;
    private emptyRenderer;
    private onSelect;
    private onRect;
}
export interface MenuContainerState {
    rect?: Rect;
}
export {};
