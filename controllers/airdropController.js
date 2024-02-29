const Distribute = require("../SkaleAirdropHelper/distribute");
const Balance = require("../SkaleAirdropHelper/balance");

exports.claimAirdrop = async (req, res) => {
  console.log(req)
  try {
    const { walletAddress } = req.params;

    const distributeResult = await Distribute({
      address: walletAddress,
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
