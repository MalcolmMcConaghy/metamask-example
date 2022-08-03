import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ReactComponent as MetaMaskLogo } from './assets/metamask-fox.svg';
import Button from './components/Button/Button';
import AccountDetails from './components/AccountDetails/AccountDetails';

export default function App() {
    const [haveMetamask, sethaveMetamask] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const [isConnectingToMetaMask, setIsConnectingToMetaMask] = useState(false);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

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

            const balance = await provider.getBalance(response[0]);
            const formattedBalance = ethers.utils.formatEther(balance);

            setAccountBalance(formattedBalance);
            setIsConnected(true);
            setIsConnectingToMetaMask(false);
        } catch (error) {
            setIsConnected(false);
        }
    };

    useEffect(() => {
        checkMetamaskAvailability();
    }, []);

    return (
        <>
            <h1>Check your MetaMask wallet balance!</h1>
            <p>
                Click the Connect to MetaMask button below to see your balance
            </p>
            <Button
                onClick={handleOnConnectClick}
                isInitialising={isConnectingToMetaMask}
                isConnected={isConnected}
            >
                Connect to MetaMask <MetaMaskLogo width={25} height={25} />
            </Button>
            {isConnected &&
                !isConnectingToMetaMask &&
                accountAddress &&
                accountBalance && (
                    <AccountDetails
                        onClick={() => console.log('clicked')}
                        address={accountAddress}
                        balance={accountBalance}
                    />
                )}
        </>
    );
}
