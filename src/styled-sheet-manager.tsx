import isPropValid from '@emotion/is-prop-valid';
import * as React from 'react';
import { StyleSheetManager as StyledComponentsStyleSheetManager } from 'styled-components';

/** @internal */
export const StyleSheetManager = (props: { children: React.ReactNode }) => {
    return (
        <StyledComponentsStyleSheetManager
            shouldForwardProp={(propName, elementToBeRendered) => {
                return typeof elementToBeRendered === 'string'
                    ? isPropValid(propName)
                    : true;
            }}
        >
            {props.children}
        </StyledComponentsStyleSheetManager>
    );
};
