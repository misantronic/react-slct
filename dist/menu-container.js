"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuContainer = void 0;
const React = require("react");
const react_dom_1 = require("react-dom");
const styled_components_1 = require("styled-components");
const utils_1 = require("./utils");
function menuPosition({ rect, menuHeight = 186 }) {
    if (!rect) {
        return 'bottom';
    }
    const { height } = rect;
    if (height === 'auto' || menuHeight === 'auto') {
        return 'bottom';
    }
    if (rect.top + height + menuHeight <= utils_1.getWindowInnerHeight()) {
        return 'bottom';
    }
    return 'top';
}
function getContainerTop(props) {
    var _a;
    const { rect } = props;
    const window = utils_1.getWindow();
    if (!rect) {
        return 0;
    }
    const menuHeight = (props.menuHeight !== 'auto' && props.menuHeight) || 186;
    const height = rect.height === 'auto' ? 32 : rect.height;
    const scrollY = (_a = window === null || window === void 0 ? void 0 : window.scrollY) !== null && _a !== void 0 ? _a : 0;
    switch (menuPosition(props)) {
        case 'top':
            return rect.top - menuHeight + 1 + scrollY;
        case 'bottom':
            return rect.top + height - 1 + scrollY;
    }
}
const MenuOverlay = styled_components_1.default.div `
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
`;
const MenuWrapper = styled_components_1.default.div `
    position: absolute;
    z-index: 9999;
    background: #fff;
    box-sizing: border-box;
    box-shadow: ${(props) => menuPosition(props) === 'bottom'
    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
    : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

    .react-slct-menu-list {
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: ${(props) => props.error ? 'var(--react-slct-error-color)' : '#ccc'};
        background-color: #fff;

        &:focus {
            outline: none;
        }
    }
`;
function MenuContainer(props) {
    const { error, onClick, children } = props;
    const className = ['react-slct-menu', props.className]
        .filter((c) => c)
        .join(' ');
    const document = utils_1.getDocument();
    const window = utils_1.getWindow();
    const menuOverlay = React.useRef(null);
    const menuWrapper = React.useRef(null);
    const [menuOverlayRect, setMenuOverlayRect] = React.useState();
    const [menuWrapperRect, setMenuWrapperRect] = React.useState();
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
        var _a;
        calcMenuWrapper();
        if (menuWrapper.current) {
            (_a = props.onRef) === null || _a === void 0 ? void 0 : _a.call(props, menuWrapper.current);
        }
    }, [menuWrapper.current]);
    React.useEffect(() => {
        var _a;
        (_a = props.onRect) === null || _a === void 0 ? void 0 : _a.call(props, menuOverlayRect, menuWrapperRect);
    }, [menuOverlayRect, menuWrapperRect]);
    React.useEffect(() => {
        window === null || window === void 0 ? void 0 : window.addEventListener('scroll', onViewportChange, true);
        window === null || window === void 0 ? void 0 : window.addEventListener('resize', onViewportChange, true);
        function allowRectChange(e) {
            if (e.target.closest && !e.target.closest('.react-slct-menu')) {
                return false;
            }
            return true;
        }
        function onViewportChange(e) {
            if (allowRectChange(e)) {
                calcMenuOverlay();
                calcMenuWrapper();
            }
        }
        return () => {
            window === null || window === void 0 ? void 0 : window.removeEventListener('resize', onViewportChange, true);
            window === null || window === void 0 ? void 0 : window.removeEventListener('scroll', onViewportChange, true);
        };
    }, []);
    const style = (() => {
        var _a;
        const { menuLeft, menuTop, menuWidth, menuHeight } = props;
        let width = menuWidth && menuWidth !== 'auto'
            ? menuWidth
            : (menuOverlayRect === null || menuOverlayRect === void 0 ? void 0 : menuOverlayRect.width) || 'auto';
        const height = menuHeight && menuHeight !== 'auto'
            ? menuHeight
            : (menuWrapperRect === null || menuWrapperRect === void 0 ? void 0 : menuWrapperRect.height) || 'auto';
        const top = menuTop !== null && menuTop !== void 0 ? menuTop : getContainerTop({
            rect: menuOverlayRect,
            menuHeight: height
        });
        let left = (_a = menuLeft !== null && menuLeft !== void 0 ? menuLeft : menuOverlayRect === null || menuOverlayRect === void 0 ? void 0 : menuOverlayRect.left) !== null && _a !== void 0 ? _a : 0;
        if (window) {
            const numWidth = Number(width);
            if (numWidth > window.innerWidth) {
                width = window.innerWidth - 20;
            }
            if (left + numWidth > window.innerWidth) {
                left = Math.max(10, window.innerWidth - numWidth - 20);
            }
        }
        if (left && top) {
            return { top, left, width, height };
        }
        return undefined;
    })();
    return (React.createElement(MenuOverlay, { ref: menuOverlay }, document && style
        ? react_dom_1.createPortal(React.createElement(MenuWrapper, { "data-role": "menu", className: className, error: error, ref: menuWrapper, onClick: onClick, rect: menuOverlayRect, style: style }, children), document.body)
        : null));
}
exports.MenuContainer = MenuContainer;
//# sourceMappingURL=menu-container.js.map