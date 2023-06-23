import { ethers } from "ethers";
import abi from "../../contracts/abi.js";

async function tokenAssociateFcn(walletData, tokenAddress) {
	console.log(`\n=======================================`);
	console.log(`- Associating token...🟠`);

	// ETHERS PROVIDER AND SIGNER
	const provider = walletData[1];
	const signer = provider.getSigner();

	// EXECUTE FUNCTION BY CALLING HTS TOKEN AS A CONTRACT INSTANCE
	let txHash;
	let outText;
	try {
		const gasLimit = 1000000;

		// CREATE CONTRACT INSTANCE FOR THE TOKEN ADDRESS
		const myContract = new ethers.Contract(tokenAddress, abi, signer);
		const associateTx = await myContract.associate({ gasLimit: gasLimit });
		const associateRx = await associateTx.wait();
		txHash = associateRx.transactionHash;
		outText = "🔗Token association complete ✅";
		console.log(`- Done! Here's the transaction hash: \n${txHash} ✅`);
	} catch (deployError) {
		console.log(`- ${deployError.message.toString()}`);
	}
	return [txHash, outText];
}
export default tokenAssociateFcn;
