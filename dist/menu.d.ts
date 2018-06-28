import * as React from 'react';
import { MenuComponentProps } from './typings';
export declare class Menu extends React.PureComponent<MenuComponentProps> {
    private static MenuContainer;
    private static Empty;
    private list;
    constructor(props: any);
    componentDidUpdate(prevProps: MenuComponentProps): void;
    render(): React.ReactNode;
    private rowRenderer;
    private onSelect;
}
