import * as React from 'react';
import { MenuContainerProps, Rect } from './typings';
export interface MenuContainerState {
    menuOverlay?: Rect;
    menuWrapper?: Rect;
}
export declare class MenuContainer extends React.PureComponent<MenuContainerProps, MenuContainerState> {
    private menuOverlay?;
    private menuWrapper?;
    private get menuOverlayRect();
    private get menuWrapperRect();
    private get style();
    private get window();
    private get document();
    constructor(props: MenuContainerProps);
    componentDidMount(): void;
    componentDidUpdate(_: any, prevState: MenuContainerState): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private addListener;
    private removeListener;
    private allowRectChange;
    private onViewportChange;
    private onMenuOverlay;
    private onMenuWrapper;
}
