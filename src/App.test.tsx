import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { ethers } from 'ethers';
import App from './App';

const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const WINDOW_ETHEREUM = {
    isMetaMask: true,
    networkVersion: '1',
    request: async (request: { method: string; params?: Array<unknown> }) => {
        if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
            return [WALLET_ADDRESS];
        }

        throw Error(`Unknown request: ${request.method}`);
    },
    on: () => {},
};
window.ethereum = WINDOW_ETHEREUM;

describe('App connection', () => {
    afterEach(() => {
        window.ethereum = { ...WINDOW_ETHEREUM };
    });
    test('renders App', async () => {
        render(<App />);
        expect(
            screen.getByRole('button', {
                name: /Connect to MetaMask/i,
            }),
        ).toBeInTheDocument();
    });

    test('a user should be able to connect using MetaMask', async () => {
        render(<App />);
        const connectButton = screen.getByRole('button', {
            name: /Connect to MetaMask/i,
        });

        expect(connectButton).toBeInTheDocument();

        await act(async () => {
            userEvent.click(connectButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Connected')).toBeInTheDocument();
            expect(screen.getByText('0xf39F...2266')).toBeInTheDocument();
        });
    });

    test('reload page after trying to connect to an unsupported network', async () => {
        window.ethereum = { ...WINDOW_ETHEREUM, networkVersion: '2' };
        render(<App />);
        const connectButton = screen.getByRole('button', {
            name: /Connect to MetaMask/i,
        });

        expect(connectButton).toBeInTheDocument();

        await act(async () => {
            userEvent.click(connectButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Reload')).toBeInTheDocument();
        });

        const reloadButton = screen.getByRole('button', {
            name: /Reload/i,
        });

        await act(async () => {
            userEvent.click(reloadButton);
        });

        await waitFor(() => {
            expect(connectButton).toBeInTheDocument();
        });
    });
});
