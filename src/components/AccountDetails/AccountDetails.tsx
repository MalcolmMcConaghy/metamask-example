/* eslint-disable react/require-default-props */
import './AccountDetails.css';

interface Props {
    onClick: () => void;
    address: string;
    balance: string;
    tokenName: string;
    usdPrice?: string;
    showUSD?: boolean;
}

function truncateString(str: string, num: number) {
    return str.length > num
        ? `${str.slice(0, num - 1)}…${str.slice(str.length - 4, str.length)}`
        : str;
}

export default function AccountDetails(props: Props) {
    const {
        onClick,
        address,
        balance,
        tokenName,
        usdPrice = '',
        showUSD = false,
    } = props;
    return (
        <div className="accountDetails">
            <button className="balanceButton" type="button" onClick={onClick}>
                {showUSD ? (
                    <>{`USD ${usdPrice}`}</>
                ) : (
                    <>
                        {balance} {tokenName}
                    </>
                )}
            </button>
            <div className="address">{truncateString(address, 7)}</div>
        </div>
    );
}
