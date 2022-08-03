import { ReactElement } from 'react';
import './Button.css';

interface Props {
    onClick: () => void;
    children: (string | ReactElement)[];
}

export default function Button(props: Props) {
    const { onClick, children } = props;
    return (
        <button className="button" type="button" onClick={onClick}>
            {children}
        </button>
    );
}
