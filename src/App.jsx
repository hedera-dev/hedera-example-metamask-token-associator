import React, { useState } from "react";
import MyGroup from "./components/MyGroup.jsx";
import MyInputGroup from "./components/MyInputGroup.jsx";
import walletConnectFcn from "./components/hedera/walletConnect.js";
import tokenAssociateFcn from "./components/hedera/tokenAssociate.js";
import "./styles/App.css";

function App() {
	const [walletData, setWalletData] = useState();
	const [account, setAccount] = useState();
	const [network, setNetwork] = useState();

	const [connectTextSt, setConnectTextSt] = useState("🔌 Connect here...");
	const [textboxTextSt, setTextboxTextSt] = useState("Enter a token address to associate");
	const [tokenAddressIn, setTokenAddress] = useState("");
	const [executeTextSt, setExecuteTextSt] = useState("");

	const [connectLinkSt, setConnectLinkSt] = useState("");
	const [executeLinkSt, setExecuteLinkSt] = useState("");

	async function connectWallet() {
		if (account !== undefined) {
			setConnectTextSt(`🔌 Account ${account} already connected ⚡ ✅`);
		} else {
			const wData = await walletConnectFcn();

			let newAccount = wData[0];
			let newNetwork = wData[2];
			if (newAccount !== undefined) {
				setConnectTextSt(`🔌 Account ${newAccount} connected ⚡ ✅`);
				setConnectLinkSt(`https://hashscan.io/${newNetwork}/account/${newAccount}`);
				setWalletData(wData);
				setAccount(newAccount);
				setNetwork(newNetwork);
			}
		}
	}

	function handleInputChange(event) {
		let textIn = event.target.value;
		setTextboxTextSt("Enter a token address to associate");
		if (textIn === "") {
			setTokenAddress();
			setExecuteTextSt();
			setExecuteLinkSt();
		} else {
			setTokenAddress(textIn);
			setExecuteTextSt("Click to confirm 👇");
			setExecuteLinkSt();
		}
	}

	async function tokenAssociate() {
		if (account === undefined || tokenAddressIn === undefined) {
			setExecuteTextSt("🛑Connect a wallet AND enter a valid token address!🛑");
		} else if (!tokenAddressIn.startsWith("0x")) {
			setExecuteTextSt("🛑Enter a valid token address (0x...)🛑");
		} else {
			setExecuteTextSt(`Associating to Token: ${tokenAddressIn}`);

			const [txHash, outText] = await tokenAssociateFcn(walletData, tokenAddressIn);

			if (txHash !== undefined && outText !== undefined) {
				setTextboxTextSt(outText);
				setExecuteTextSt(`Done! Transaction Hash: ${txHash} ✅`);
				setExecuteLinkSt(`https://hashscan.io/${network}/tx/${txHash}`);
			} else {
				setTextboxTextSt("Enter a token address to associate");
				setExecuteTextSt(`Association failed - try again 🔴`);
				setExecuteLinkSt("");
			}
		}
	}

	//=====================

	return (
		<div className="App">
			<h1 className="header">Associate your Hedera account with native tokens using MetaMask!</h1>

			<MyGroup fcn={connectWallet} buttonLabel={"Connect Wallet"} text={connectTextSt} link={connectLinkSt} />

			<MyInputGroup fcn={handleInputChange} text={textboxTextSt} />

			<MyGroup fcn={tokenAssociate} buttonLabel={"Associate Token"} text={executeTextSt} link={executeLinkSt} />

			<div className="logo">
				<div className="symbol">
					<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
						<path d="M20 0a20 20 0 1 0 20 20A20 20 0 0 0 20 0" className="circle"></path>
						<path d="M28.13 28.65h-2.54v-5.4H14.41v5.4h-2.54V11.14h2.54v5.27h11.18v-5.27h2.54zm-13.6-7.42h11.18v-2.79H14.53z" className="h"></path>
					</svg>
				</div>
				<span>Hedera</span>
			</div>
		</div>
	);
}
export default App;
