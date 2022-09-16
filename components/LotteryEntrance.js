import { useWeb3Contract, useMoralis } from "react-moralis"
import contractAddresses from "../constants/contractAddresses.json"
import abi from "../constants/abi.json"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

// have a function to enter the lottery
// use Moralis useWeb3Contract hook :)

const LotteryEntrance = () => {
    // STATE
    const [entranceFee, setEntranceFee] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [loading, setLoading] = useState(false)

    let numPlayersUI = parseInt(numPlayers)

    const dispatch = useNotification()

    const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis()
    // console.log(parseInt(chainIdHex)) // changes the hex to a number
    const chainId = parseInt(chainIdHex)
    // console.log(contractAddresses)
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // enterLottery
    const {
        runContractFunction: enterLottery,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, // specify networkId
        functionName: "enterLottery",
        // optional
        params: {},
        // how to pass a msg.value ? --> read from getEntranceFee and set useState
        msgValue: entranceFee,
    })

    // getEntranceFee
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, // specify networkId
        functionName: "getEntranceFee",
        // optional
        params: {},
    })

    // getMostRecentWinner
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, // specify networkId
        functionName: "getRecentWinner",
        // optional
        params: {},
    })

    // getNumPlayers
    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, // specify networkId
        functionName: "getNumPlayers",
        // optional
        params: {},
    })

    async function updateUI() {
        const feeFromContract = await getEntranceFee()
        const recentWinnerFromCall = await getRecentWinner()
        const numPlayersFromCall = await getNumPlayers()
        setEntranceFee(feeFromContract)
        setRecentWinner(recentWinnerFromCall)
        setNumPlayers(numPlayersFromCall)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            title: "Enter Lottery",
            message: "Transaction Complete!",
            position: "topR",
        })
    }

    const successHandler = async (tx) => {
        setLoading(true)
        await tx.wait(1)
        setLoading(false)
        updateUI()
        handleNewNotification(tx)
    }

    const listenForWinnerChosen = async () => {
        const lottery = new ethers.Contract(contractAddresses, abi, web3)
        // console.log(lottery)
        lottery.on("WinnerChosen", async () => {
            updateUI()
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
            listenForWinnerChosen()
        }
    }, [isWeb3Enabled, listenForWinnerChosen])

    return (
        <div className="flex flex-col justify-center items-center mt-[120px] text-white border-10 rounded-lg w-[800px] mx-auto h-[500px]">
            {lotteryAddress ? (
                <div>
                    <div className="mb-[100px]">
                        <p className="py-4 text-lg tracking-wider">
                            <span className="font-bold"> 🤑 Entrance Fee:</span>{" "}
                            <span className="italic">{ethers.utils.formatUnits(entranceFee, "ether")} ETH</span>
                        </p>
                        <p className="py-4 text-lg tracking-wider">
                            <span className="font-bold">
                                🎟 Number of entries:
                            </span>{" "}
                            {numPlayersUI}
                        </p>
                        <p className="py-4 text-lg tracking-wider">
                            <span className="font-bold">
                                {" "}
                                🚀 Most recent winner:
                            </span>{" "}
                            <span className="italic">{recentWinner}</span>
                        </p>
                        <p className="py-4 text-lg tracking-wider">
                            <span className="font-bold">💰 Jackpot value:</span>{" "}
                            <span className="italic">{(
        ethers.utils.formatUnits(entranceFee, "ether") * numPlayersUI
    ).toFixed(1)} ETH</span>
                        </p>
                    </div>

                    <div className="flex justify-center items-center">
                        <button
                            onClick={async () => {
                                await enterLottery({
                                    onError: (error) => console.log(error),
                                    // onComplete:
                                    onSuccess: successHandler,
                                })
                            }}
                            disabled={isLoading || isFetching}
                            className="py-4 px-6 text-lg bg-white hover:bg-blue-800 hover:text-white rounded-lg font-bold font-sans tracking-wider text-blue-800"
                        >
                            {loading || isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                <div>Enter Lottery</div>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h4 className="text-3xl">
                        Please connect to the goerli network
                    </h4>
                </div>
            )}
        </div>
    )
}

export default LotteryEntrance
