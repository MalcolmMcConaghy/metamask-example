/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
import { ReactElement } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './Button.css';

interface Props {
    onClick: () => void;
    isInitialising?: boolean;
    isConnected?: boolean;
    reload?: boolean;
    children: ReactElement;
}

export default function Button(props: Props) {
    const {
        onClick,
        isInitialising = false,
        isConnected = false,
        reload = false,
        children,
    } = props;

    const buttonClassName = reload ? 'reloadButton' : 'button';
    return (
        <button
            className={buttonClassName}
            type="button"
            onClick={onClick}
            disabled={isInitialising || isConnected}
        >
            {isInitialising ? (
                <>
                    Initializing... <Spinner animation="border" role="status" />
                </>
            ) : isConnected ? (
                <>Connected</>
            ) : (
                children
            )}
        </button>
    );
}
