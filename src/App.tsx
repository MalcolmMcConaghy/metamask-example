/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ReactComponent as MetaMaskLogo } from './assets/metamask-fox.svg';
import Button from './components/Button/Button';
import AccountDetails from './components/AccountDetails/AccountDetails';
import { chainIdMap } from './constants/chainIdMap';
import { CoinResponse } from './types/coinstats';
import './App.css';

export default function App() {
    const [haveMetamask, sethaveMetamask] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [unsupportedNetwork, setUnsupportedNetwork] = useState(false);
    const [showUSD, setShowUSD] = useState(false);
    const [isConnectingToMetaMask, setIsConnectingToMetaMask] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [USDPrice, setUSDPrice] = useState('');
    const [connectedNetwork, setConnectedNetwork] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [accountAddress, setAccountAddress] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const checkMetamaskAvailability = () => {
        if (!ethereum) {
            sethaveMetamask(false);
        }
        sethaveMetamask(true);
    };

    const getBalance = async () => {
        if (!accountAddress) return;
        const balance = await provider.getBalance(accountAddress);
        const formattedBalance = ethers.utils.formatEther(balance);
        const roundedBalance = Math.round(Number(formattedBalance) * 1e4) / 1e4;
        setAccountBalance(roundedBalance.toString());
    };

    const getAccountAndBalance = async () => {
        try {
            const response = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            setAccountAddress(response[0]);
            await getBalance();
            setConnectedNetwork(
                chainIdMap.get(window.ethereum.networkVersion) ?? '',
            );

            setIsConnected(true);
        } catch (error) {
            setIsConnected(false);
            setHasError(true);
        }
    };

    const handleOnConnectClick = async () => {
        setIsConnectingToMetaMask(true);
        try {
            checkMetamaskAvailability();
            await getAccountAndBalance();
            setIsConnectingToMetaMask(false);
        } catch (error) {
            setIsConnected(false);
            setHasError(true);
        }
    };

    const handleOnReloadClick = () => {
        window.location.reload();
    };

    const handleOnBalanceClick = async () => {
        if (!USDPrice) {
            try {
                const response = await fetch(
                    `https://api.coinstats.app/public/v1/coins/${connectedNetwork}?currency=USD`,
                );

                const coinResponse: CoinResponse = await response.json();

                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });

                const usdPrice = formatter.format(
                    coinResponse.coin.price * Number(accountBalance),
                );
                setUSDPrice(usdPrice);
            } catch (error) {
                setIsConnected(false);
                setHasError(true);
            }
        }

        setShowUSD(!showUSD);
    };

    useEffect(() => {
        checkMetamaskAvailability();
    }, []);

    useEffect(() => {
        switch (connectedNetwork) {
            case 'ethereum':
                setTokenName('ETH');
                break;
            case 'binance-coin':
                setTokenName('BSC');
                break;
            case 'matic-network':
                setTokenName('MATIC');
                break;
            default:
                setTokenName('NOT-SUPPORTED');
        }
    }, [connectedNetwork]);

    useEffect(() => {
        if (tokenName !== 'NOT-SUPPORTED' || !isConnected) return;
        setUnsupportedNetwork(true);
    }, [tokenName, isConnected]);

    useEffect(() => {
        if (!ethereum) return;
        ethereum.on('chainChanged', () => {
            window.location.reload();
        });
        ethereum.on('accountsChanged', () => {
            window.location.reload();
        });
    });

    useEffect(() => {
        provider.on('block', getBalance);
    }, [getBalance]);

    console.log(connectedNetwork);

    return (
        <>
            <h1>Check your MetaMask wallet balance!</h1>
            <p>
                Click the Connect to MetaMask button below to see your balance
            </p>
            <p>Once connected, click your balance to see the value in USD</p>
            {haveMetamask ? (
                <>
                    {unsupportedNetwork || hasError ? (
                        <>
                            <Button onClick={handleOnReloadClick} reload>
                                <>Reload</>
                            </Button>
                            {hasError ? (
                                <p className="errorMessage">
                                    An unexpected error has occured. Please
                                    reload and try again
                                </p>
                            ) : (
                                <p className="unsupportedNetwork">
                                    The current connected network is an
                                    unsupported network. Please switch to a
                                    Ethereum, MATIC or Binance-coin network
                                </p>
                            )}
                        </>
                    ) : (
                        <Button
                            onClick={handleOnConnectClick}
                            isInitialising={isConnectingToMetaMask}
                            isConnected={isConnected}
                        >
                            <>
                                <span className="buttonLabel">
                                    Connect to MetaMask
                                </span>
                                <MetaMaskLogo width={25} height={25} />
                            </>
                        </Button>
                    )}
                </>
            ) : (
                <p>
                    You don&apos;t have MetaMask installed. Please install the
                    MetaMask extension to use this app.
                </p>
            )}

            {isConnected &&
                !isConnectingToMetaMask &&
                !unsupportedNetwork &&
                accountAddress &&
                accountBalance && (
                    <AccountDetails
                        onClick={handleOnBalanceClick}
                        address={accountAddress}
                        balance={accountBalance}
                        tokenName={tokenName}
                        usdPrice={USDPrice}
                        showUSD={showUSD}
                    />
                )}
        </>
    );
}
