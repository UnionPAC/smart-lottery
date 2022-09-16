import { ConnectButton } from "@web3uikit/web3"
import Link from "next/link"

const Header = () => {
    return (
        <div className="pl-6 pt-4 text-white font-sans">
            <h1 className="text-5xl pb-4  font-bold  text-white tracking-wider">
                Smart Lottery
            </h1>
            <p className="py-2">A new winner is chosen every hour!</p>
            <p className=" italic fixed bottom-10 text-sm">
                <Link
                    href="https://goerli.etherscan.io/address/0xed5EA0297978614D14A1f76ff86B3D9594075765"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View contract on Etherscan
                </Link>
            </p>

            <ConnectButton
                moralisAuth={false}
                className="fixed top-10 right-10"
            />
        </div>
    )
}

export default Header
