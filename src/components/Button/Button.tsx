import { ReactComponent as MetaMaskLogo } from '../../assets/metamask-fox.svg';
import './Button.css';

interface Props {
    onClick: () => void;
}

export default function Button(props: Props) {
    const { onClick } = props;
    return (
        <button className="button" type="button" onClick={onClick}>
            Connect to MetaMask <MetaMaskLogo width={25} height={25} />
        </button>
    );
}
