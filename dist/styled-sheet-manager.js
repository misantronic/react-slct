"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleSheetManager = void 0;
const is_prop_valid_1 = require("@emotion/is-prop-valid");
const React = require("react");
const styled_components_1 = require("styled-components");
/** @internal */
const StyleSheetManager = (props) => {
    return (React.createElement(styled_components_1.StyleSheetManager, { shouldForwardProp: (propName, elementToBeRendered) => {
            return typeof elementToBeRendered === 'string'
                ? (0, is_prop_valid_1.default)(propName)
                : true;
        } }, props.children));
};
exports.StyleSheetManager = StyleSheetManager;
//# sourceMappingURL=styled-sheet-manager.js.map