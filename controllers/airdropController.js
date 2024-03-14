const Distribute = require("../SkaleAirdropHelper/distribute");
const Balance = require("../SkaleAirdropHelper/balance");
const { JsonRpcProvider } = require("ethers");
const { ethers } = require("ethers");
const { RPC_URL } = require("../SkaleAirdropHelper/config");

exports.claimAirdrop = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const provider = new JsonRpcProvider(RPC_URL);
    const balance = await provider.getBalance(walletAddress);

    if (balance < 100000000000000) {
      // If balance is less than 0.00001 ethers, distribute airdrop
      const distributeResult = await Distribute({
        address: walletAddress,
      });

      res.status(200).json({
        message: "Airdrop distributed successfully",
        distributeResult,
      });
    } else {
      // If balance is greater than 0.00001 ethers, do not distribute airdrop
      res.status(200).json({
        message: "Balance is sufficient, no need for airdrop distribution",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const balance = await Balance();
    res.status(200).json({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
