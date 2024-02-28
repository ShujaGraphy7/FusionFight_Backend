const Distribute = require("../SkaleAirdropHelper/distribute");
const Balance = require("../SkaleAirdropHelper/balance");

const User = require("../models/user");

exports.claimAirdrop = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Assuming Distribute is an asynchronous function, make sure to use await
    const distributeResult = await Distribute({
      walletAddress: lowercaseWalletAddress,
    });

    res.status(200).json({ distributeResult });
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
