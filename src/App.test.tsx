import { generateTestingUtils } from 'eth-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

describe('App connection', () => {
    const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });
    beforeAll(() => {
        // Manually inject the mocked provider in the window as MetaMask does
        global.window.ethereum = testingUtils.getProvider();
    });
    afterEach(() => {
        // Clear all mocks between tests
        testingUtils.clearAllMocks();
    });
    test('renders App', async () => {
        testingUtils.mockNotConnectedWallet();
        render(<App />);
        expect(
            screen.getByRole('button', {
                name: /Connect to MetaMask/i,
            }),
        ).toBeInTheDocument();
    });

    test('a user should be able to connect using MetaMask', async () => {
        // Start with not connected wallet
        testingUtils.mockNotConnectedWallet();
        // Mock the connection request of MetaMask
        testingUtils.mockRequestAccounts([
            '0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf',
        ]);
        testingUtils.mockChainId('0x1');

        render(<App />);
        const connectButton = screen.getByRole('button', {
            name: /Connect to MetaMask/i,
        });

        expect(connectButton).toBeInTheDocument();

        userEvent.click(connectButton);

        await waitFor(() => {
            expect(screen.getByText('Connected')).toBeInTheDocument();
        });
    });
});
