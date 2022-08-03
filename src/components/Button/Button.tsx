import { ReactElement } from 'react';
import './Button.css';

interface Props {
    onClick: () => void;
    isInitialising: boolean;
    children: (string | ReactElement)[];
}

export default function Button(props: Props) {
    const { onClick, isInitialising, children } = props;
    return (
        <button className="button" type="button" onClick={onClick}>
            {isInitialising ? <>Initializing...</> : children}
        </button>
    );
}
