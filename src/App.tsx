import { useEffect, useState } from 'react';
import { ReactComponent as MetaMaskLogo } from './assets/metamask-fox.svg';
import Button from './components/Button/Button';

export default function App() {
    const [haveMetamask, sethaveMetamask] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');
    const [isConnectingToMetaMask, setIsConnectingToMetaMask] = useState(false);
    const { ethereum } = window;

    const checkMetamaskAvailability = () => {
        if (!ethereum) {
            sethaveMetamask(false);
        }
        sethaveMetamask(true);
    };

    const handleOnConnectClick = async () => {
        setIsConnectingToMetaMask(true);
        await new Promise((r) => setTimeout(r, 2000));
        try {
            checkMetamaskAvailability();
            const response = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            setAccountAddress(response[0]);
            setIsConnected(true);
            setIsConnectingToMetaMask(false);
        } catch (error) {
            setIsConnected(false);
        }
    };

    useEffect(() => {
        checkMetamaskAvailability();
    }, []);

    useEffect(() => {
        console.log(accountAddress);
    }, [accountAddress]);

    return (
        <Button
            onClick={handleOnConnectClick}
            isInitialising={isConnectingToMetaMask}
        >
            Connect to MetaMask <MetaMaskLogo width={25} height={25} />
        </Button>
    );
}
