import * as React from 'react';
import { MenuContainerProps, Rect } from './typings';
export interface MenuContainerState {
    rect?: Rect;
}
export declare class MenuContainer extends React.PureComponent<MenuContainerProps, MenuContainerState> {
    private el?;
    private readonly rect;
    private readonly style;
    private readonly window;
    private readonly document;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(_: any, prevState: MenuContainerState): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private addListener;
    private removeListener;
    private allowRectChange;
    private onViewportChange;
    private onEl;
}
