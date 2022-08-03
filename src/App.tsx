import { ReactComponent as MetaMaskLogo } from './assets/metamask-fox.svg';
import Button from './components/Button/Button';

export default function App() {
    return (
        <Button onClick={() => alert('Hello world')}>
            Connect to MetaMask <MetaMaskLogo width={25} height={25} />
        </Button>
    );
}
