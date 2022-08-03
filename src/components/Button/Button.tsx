/* eslint-disable no-nested-ternary */
import { ReactElement } from 'react';
import './Button.css';

interface Props {
    onClick: () => void;
    isInitialising: boolean;
    isConnected: boolean;
    children: (string | ReactElement)[];
}

export default function Button(props: Props) {
    const { onClick, isInitialising, isConnected, children } = props;
    return (
        <button className="button" type="button" onClick={onClick}>
            {isInitialising ? (
                <>Initializing...</>
            ) : isConnected ? (
                <>Connected</>
            ) : (
                children
            )}
        </button>
    );
}
