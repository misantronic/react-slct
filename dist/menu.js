"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_window_1 = require("react-window");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
const menu_container_1 = require("./menu-container");
const menu_row_1 = require("./menu-row");
const option_1 = require("./option");
const utils_1 = require("./utils");
const EmptyOptionItem = styled_components_1.default(option_1.OptionComponent.OptionItem) `
    height: 100%;
    border: 1px solid #ccc;
`;
const Empty = (props) => (React.createElement(EmptyOptionItem, null,
    React.createElement(label_1.SelectLabel, null,
        React.createElement("i", null, props.emptyText || 'No results'))));
function Menu(props) {
    const { rowHeight = 32, selectedIndex, open, error, menuWidth, menuHeight, multi, hideSelectedOptions } = props;
    const currentValue = utils_1.isArray(props.value) && multi ? props.value : [props.value];
    const options = React.useMemo(() => (props.options || []).filter(option => {
        if (hideSelectedOptions) {
            const selected = currentValue.some(val => utils_1.equal(val, option.value, props.equalCompareProp));
            if (selected) {
                return false;
            }
        }
        return true;
    }), [
        props.options,
        props.equalCompareProp,
        hideSelectedOptions,
        currentValue
    ]);
    const [rect, setRect] = react_1.useState();
    const list = react_1.useRef(null);
    const width = menuWidth || (rect && rect.width !== 'auto' ? rect.width : 0);
    const height = Math.min(Math.max(options.length * rowHeight, rowHeight) + 2, menuHeight || 185);
    react_1.useEffect(() => {
        if (open &&
            list.current &&
            selectedIndex !== undefined &&
            selectedIndex !== -1) {
            list.current.scrollToItem(selectedIndex, 'center');
        }
    }, [open]);
    const itemData = React.useMemo(() => {
        return Object.assign(Object.assign({}, props), { options, onSelect: (value, option) => {
                if (utils_1.isArray(props.value) && props.multi) {
                    const found = props.value.some(item => utils_1.equal(item, value, props.equalCompareProp));
                    const values = found
                        ? props.value.filter(item => !utils_1.equal(item, value, props.equalCompareProp))
                        : Array.from(new Set([...props.value, value]));
                    props.onSelect(values, option);
                }
                else {
                    props.onSelect(value, option);
                }
            } });
    }, [
        options.length,
        props.search,
        props.rowHeight,
        props.selectedIndex,
        props.labelComponent,
        props.optionComponent,
        props.value
    ]);
    function renderList(width, height, rowHeight) {
        const MenuContent = props.menuComponent;
        const itemCount = options.length;
        if (MenuContent) {
            return React.createElement(MenuContent, Object.assign({}, props));
        }
        if (itemCount === 0) {
            return React.createElement(Empty, { emptyText: props.emptyText });
        }
        return (React.createElement(react_window_1.FixedSizeList, { className: "react-slct-menu-list", ref: list, width: width, height: height, itemSize: rowHeight, itemCount: itemCount, itemData: itemData }, menu_row_1.MenuRow));
    }
    return open ? (React.createElement(menu_container_1.MenuContainer, { error: error, menuWidth: width, menuHeight: height, onRect: rect => setRect(rect) }, renderList(width, height, rowHeight))) : null;
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map