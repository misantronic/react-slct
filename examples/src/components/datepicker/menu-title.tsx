import * as React from 'react';
import styled from 'styled-components';

interface MenuTitleProps {
    date: Date;
    onPrevMonth(): void;
    onNextMonth(): void;
    onToday(): void;
    onMonths(): void;
    onYear(): void;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    justify-content: space-between;
`;

const Button = styled.button`
    margin-left: 5px;
    cursor: pointer;
`;

const monthFormat = new Intl.DateTimeFormat('de-DE', {
    month: 'short'
});

const yearFormat = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric'
});

export class MenuTitle extends React.PureComponent<MenuTitleProps> {
    public render(): React.ReactNode {
        const {
            date,
            onNextMonth,
            onPrevMonth,
            onToday,
            onMonths,
            onYear
        } = this.props;

        return (
            <Container>
                <div>
                    <button onClick={onMonths}>
                        <b>{monthFormat.format(date)}</b>
                    </button>
                    <Button onClick={onYear}>{yearFormat.format(date)}</Button>
                </div>
                <div style={{ display: 'flex' }}>
                    <Button onClick={onPrevMonth}>prev</Button>
                    <Button onClick={onToday}>○</Button>
                    <Button onClick={onNextMonth}>next</Button>
                </div>
            </Container>
        );
    }
}
