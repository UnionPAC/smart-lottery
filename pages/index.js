import Head from "next/head"

// Components
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className="p-10 min-h-screen bg-main-gradient">
            <Head>
                <title>Smart Lottery</title>
                <meta
                    name="description"
                    content="A decentralized lottery powered by a smart contract!"
                />
                <link rel="icon" href="/slot-machine.png" />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
