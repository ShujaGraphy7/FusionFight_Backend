// const {isAddress} = require("ethers");
const Distribute = require("../SkaleAirdropHelper/distribute");
const Balance = require("../SkaleAirdropHelper/balance");

exports.claimAirdrop = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const existingUser = await User.findOne({ walletAddress });

    if (existingUser) {
      // If a user with the same wallet address exists, throw an error
      return res
        .status(400)
        .json({ message: "User with this wallet address already exists" });
    }

    const lowercaseWalletAddress = walletAddress.toLowerCase();

    const distribute = await Distribute({
      walletAddress: lowercaseWalletAddress,
    });

    res.status(200).json({ distribute });
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
