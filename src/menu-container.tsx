import * as React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ReactSlctColors } from './config';
import { MenuContainerProps, Rect } from './typings';
import { getDocument, getWindow, getWindowInnerHeight } from './utils';

interface MenuWrapperProps {
    rect?: Rect;
    menuHeight?: MenuContainerProps['menuHeight'];
    error?: boolean;
}

function menuPosition({
    rect,
    menuHeight = 186
}: MenuWrapperProps): 'top' | 'bottom' {
    if (!rect) {
        return 'bottom';
    }

    const { height } = rect;

    if (height === 'auto' || menuHeight === 'auto') {
        return 'bottom';
    }

    if (
        rect.top + height + menuHeight <= getWindowInnerHeight() ||
        rect.top < menuHeight / 2
    ) {
        return 'bottom';
    }

    return 'top';
}

function getContainerTop(props: MenuWrapperProps): number {
    const { rect } = props;
    const window = getWindow();

    if (!rect) {
        return 0;
    }

    const menuHeight = (props.menuHeight !== 'auto' && props.menuHeight) || 186;
    const height = rect.height === 'auto' ? 32 : rect.height;
    const scrollY = window?.scrollY ?? 0;

    switch (menuPosition(props)) {
        case 'top':
            return rect.top - menuHeight + 1 + scrollY;
        case 'bottom':
            return rect.top + height - 1 + scrollY;
    }
}

const MenuOverlay = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
`;

// position this container fixed is not working well on mobile-devices
// @see https://medium.com/@im_rahul/safari-and-position-fixed-978122be5f29
const MenuWrapper = styled.div`
    position: absolute;
    z-index: 9999;
    background: #fff;
    box-sizing: border-box;
    box-shadow: ${(props: MenuWrapperProps) =>
        menuPosition(props) === 'bottom'
            ? '0 2px 5px rgba(0, 0, 0, 0.1)'
            : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

    .react-slct-menu-list {
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: ${(props: MenuWrapperProps) =>
            props.error ? ReactSlctColors.error : '#ccc'};
        background-color: #fff;

        &:focus {
            outline: none;
        }
    }
`;

export function MenuContainer(props: MenuContainerProps) {
    const { error, onClick, children } = props;
    const className = ['react-slct-menu', props.className]
        .filter((c) => c)
        .join(' ');
    const document = getDocument();
    const window = getWindow();
    const menuOverlay = React.useRef<HTMLDivElement | null>(null);
    const menuWrapper = React.useRef<HTMLDivElement | null>(null);
    const [menuOverlayRect, setMenuOverlayRect] = React.useState<Rect>();
    const [menuWrapperRect, setMenuWrapperRect] = React.useState<Rect>();

    const style = React.useMemo<Rect>(() => {
        const { menuLeft, menuTop, menuWidth, menuHeight } = props;
        let width =
            menuWidth && menuWidth !== 'auto'
                ? menuWidth
                : menuOverlayRect?.width || 'auto';
        let height =
            menuHeight && menuHeight !== 'auto'
                ? menuHeight
                : menuWrapperRect?.height || 'auto';
        let top =
            menuTop ??
            getContainerTop({
                rect: menuOverlayRect,
                menuHeight: height
            });
        let left = menuLeft ?? menuOverlayRect?.left ?? 0;

        if (window) {
            const numWidth = Number(width);

            if (numWidth > window.innerWidth) {
                width = window.innerWidth - 20;
            }

            if (left + numWidth > window.innerWidth) {
                left = Math.max(10, window.innerWidth - numWidth - 20);
            }
        }

        if (top < 0) {
            if (height !== 'auto') {
                height += top;
                top = 0;
            }
        }

        return { top, left, width, height };
    }, [
        props.menuLeft,
        props.menuTop,
        props.menuWidth,
        props.menuHeight,
        menuOverlayRect,
        menuWrapperRect
    ]);

    function calcMenuOverlay() {
        if (menuOverlay.current) {
            const clientRect = menuOverlay.current.getBoundingClientRect();

            setMenuOverlayRect({
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            });
        }
    }

    function calcMenuWrapper() {
        if (menuWrapper.current) {
            const clientRect = menuWrapper.current.getBoundingClientRect();

            setMenuWrapperRect({
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            });
        }
    }

    React.useEffect(calcMenuOverlay, [menuOverlay.current]);

    React.useEffect(() => {
        calcMenuWrapper();

        if (menuWrapper.current) {
            props.onRef?.(menuWrapper.current);
        }
    }, [menuWrapper.current]);

    React.useEffect(() => {
        props.onRect?.(menuOverlayRect, menuWrapperRect);
    }, [menuOverlayRect, menuWrapperRect]);

    React.useEffect(() => {
        window?.addEventListener('scroll', onViewportChange, true);
        window?.addEventListener('resize', onViewportChange, true);

        function allowRectChange(e) {
            if (e.target.closest && !e.target.closest('.react-slct-menu')) {
                return false;
            }

            return true;
        }

        function onViewportChange(e: Event) {
            if (allowRectChange(e)) {
                calcMenuOverlay();
                calcMenuWrapper();
            }
        }

        return () => {
            window?.removeEventListener('resize', onViewportChange, true);
            window?.removeEventListener('scroll', onViewportChange, true);
        };
    }, []);

    React.useEffect(() => {
        if (style) {
            props.onStyle?.(style);
        }
    }, [style]);

    return (
        <MenuOverlay ref={menuOverlay}>
            {document && style
                ? createPortal(
                      <MenuWrapper
                          data-role="menu"
                          className={className}
                          error={error}
                          ref={menuWrapper}
                          onClick={onClick}
                          rect={menuOverlayRect}
                          style={style}
                      >
                          {children}
                      </MenuWrapper>,
                      document.body
                  )
                : null}
        </MenuOverlay>
    );
}
