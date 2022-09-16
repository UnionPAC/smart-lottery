import { useEffect } from "react"
import { useMoralis } from "react-moralis"

const ManualHeader = () => {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (window) {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (!account) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Account not found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    <p>
                        Connected account: {account.slice(0, 6)}...
                        {account.slice(account.length - 4)}
                    </p>
                </div>
            ) : (
                <button
                    onClick={() => {
                        enableWeb3()
                        if (window) {
                            localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader
