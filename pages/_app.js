import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "@web3uikit/core"
import "../styles/global.css"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
