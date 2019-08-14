import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { MenuContainer } from './menu-container';
import { MenuRow } from './menu-row';
import { OptionComponent } from './option';
import { MenuComponentProps, Option, Rect } from './typings';
import { equal, isArray } from './utils';

const EmptyOptionItem = styled(OptionComponent.OptionItem)`
    height: 100%;
    border: 1px solid #ccc;
`;

const Empty = (props: { emptyText?: string }) => (
    <EmptyOptionItem>
        <SelectLabel>
            <i>{props.emptyText || 'No results'}</i>
        </SelectLabel>
    </EmptyOptionItem>
);

export function Menu(props: MenuComponentProps) {
    const {
        options = [],
        rowHeight = 32,
        selectedIndex,
        open,
        error,
        menuWidth,
        menuHeight
    } = props;
    const [rect, setRect] = useState<Rect>();
    const list = useRef<FixedSizeList>(null);
    const width = menuWidth || (rect && rect.width !== 'auto' ? rect.width : 0);
    const height = Math.min(
        Math.max(options.length * rowHeight, rowHeight) + 2,
        menuHeight || 185
    );

    useEffect(() => {
        if (
            open &&
            list.current &&
            selectedIndex !== undefined &&
            selectedIndex !== -1
        ) {
            list.current.scrollToItem(selectedIndex, 'center');
        }
    }, [open]);
    const itemData = React.useMemo(() => {
        return {
            ...props,
            onSelect: (value: any, option: Option) => {
                if (isArray(props.value)) {
                    const found = props.value.some(item => equal(item, value));
                    const values = found
                        ? props.value.filter(item => !equal(item, value))
                        : Array.from(new Set([...props.value, value]));

                    props.onSelect(values, option);
                } else {
                    props.onSelect(value, option);
                }
            }
        };
    }, [
        options.length,
        props.search,
        props.rowHeight,
        props.selectedIndex,
        props.labelComponent,
        props.optionComponent,
        props.value
    ]);

    function renderList(width: number, height: number, rowHeight: number) {
        const MenuContent = props.menuComponent;
        const itemCount = options.length;

        if (MenuContent) {
            return <MenuContent {...props} />;
        }

        if (itemCount === 0) {
            return <Empty emptyText={props.emptyText} />;
        }

        return (
            <FixedSizeList
                className="react-slct-menu-list"
                ref={list}
                width={width}
                height={height}
                itemSize={rowHeight}
                itemCount={itemCount}
                itemData={itemData}
            >
                {MenuRow}
            </FixedSizeList>
        );
    }

    return open ? (
        <MenuContainer
            error={error}
            menuWidth={width}
            menuHeight={height}
            onRect={rect => setRect(rect)}
        >
            {renderList(width, height, rowHeight)}
        </MenuContainer>
    ) : null;
}
