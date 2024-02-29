const { JsonRpcProvider, Wallet } = require("ethers");

const {
	DISTRIBUTION_VALUE,
	PRIVATE_KEY,
	RPC_URL
} = require("./config");

const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

async function Distribute({ address }) {
	try {
		console.log({address});
		// Send a transaction to the specified address with the specified ETH value
		const transaction = await wallet.sendTransaction({
			to: address,
			value: DISTRIBUTION_VALUE,
		});

		// Return information about the transaction
		return {
			transaction: transaction,
			// transactionHash: transaction.hash,
			amountSent: DISTRIBUTION_VALUE.toString(), // Convert BigInt to string
			to: address,
		};
	} catch (error) {
		// Handle any errors that may occur during the transaction
		console.error("Error sending transaction:", error.message);
		throw error; // Re-throw the error for further handling in the calling code
	}
}

module.exports = Distribute;