const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Find the user by wallet address
    const user = await User.findOne({ walletAddress: lowercaseWalletAddress });

    if (!user) {
      return res.status(404).json({ data: { is_ok: false } });
    }

    // Attach the user object to the request for later use
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if the user has played at least one game
const hasPlayedGame = async (req, res, next) => {
  try {
    const { user } = req;

    // Check your logic for determining if the user has played at least one game
    // For example, you might have a field in the user model that tracks this

    if (user.totalMatches < 1) {
      return res.status(403).json({ message: "User has not played at least one game" });
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { isAuthenticated, hasPlayedGame };
