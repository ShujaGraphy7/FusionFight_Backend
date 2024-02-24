// const {isAddress} = require("ethers");
const Distribute = require("../SkaleAirdropHelper/distribute");
const Balance = require("../SkaleAirdropHelper/balance");

exports.claimAirdrop = async (req, res) => {
  try {
    const { address } = req.params;
    console.log(address);

    // if (!isAddress(address)) {
    //   return res.status(400).json({ message: "Invalid Ethereum Address" });
    // }

    const distribute = await Distribute({ address });

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


