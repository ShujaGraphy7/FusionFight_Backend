const User = require("../models/user");
const { isAuthenticated, hasPlayedGame } = require("../middleware/middlewares");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "username walletAddress wonMatches lostMatches totalMatches totalPoints lastTokenUpdate referralCode"
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, walletAddress, referralCode } = req.body;

    // Check if a user with the same wallet address already exists
    const existingUser = await User.findOne({ walletAddress });

    if (existingUser) {
      // If a user with the same wallet address exists, throw an error
      return res
        .status(400)
        .json({ message: "User with this wallet address already exists" });
    }

    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Check if a referral code is provided and handle the referral system
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (referrer) {
        // If referrer is found, create a new user with the referral code
        const newUser = new User({
          username,
          walletAddress: lowercaseWalletAddress,
          totalPoints: 50 + 25, // Initial points (50) + referral points (20)
        });

        // Save new user to the database
        await newUser.save();

        // Give 25 points to the referrer
        referrer.totalPoints += 50;

        // Save the changes to the referrer
        await referrer.save();

        return res.status(201).json({ message: "User registered successfully" });
      } else {
        // If referrer is not found, return an error
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    // If no referral code is provided, create a new user without referral points
    const newUser = new User({
      username,
      walletAddress: lowercaseWalletAddress,
      totalPoints: 50,
    });

    // Save new user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateWonMatch = [isAuthenticated, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Increment the wonMatches and totalMatches counters for the specified user
    await User.findOneAndUpdate(
      { walletAddress: lowercaseWalletAddress },
      { $inc: { wonMatches: 1, totalMatches: 1, totalPoints: 5 } }
    );

    res.status(200).json({ message: "Won match updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}];

exports.updateLostMatch = [isAuthenticated, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Increment the lostMatches and totalMatches counters for the specified user
    await User.findOneAndUpdate(
      { walletAddress: lowercaseWalletAddress },
      { $inc: { lostMatches: 1, totalMatches: 1 } }
    );

    res.status(200).json({ message: "Lost match updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}];

exports.getUserDetails = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Fetch user details based on wallet address
    const userDetails = await User.findOne(
      { walletAddress: lowercaseWalletAddress },
      "username walletAddress wonMatches lostMatches totalMatches totalPoints lastTokenUpdate referralCode"
    );

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserPoints = [isAuthenticated, async (req, res) => {
  try {
    const { user } = req;

    // Get the current timestamp
    const currentTime = Date.now();

    const { lastTokenUpdate } = user;

    // Calculate time difference in hours
    const timeDifferenceHours =
      (currentTime - lastTokenUpdate) / (1000 * 60 * 60);

    // Update total points only if 24 hours have passed since the last match
    if (timeDifferenceHours >= 24) {
      await User.findOneAndUpdate(
        { walletAddress: user.walletAddress },
        { $inc: { totalPoints: 5 }, lastTokenUpdate: currentTime }
      );

      res.status(200).json({ message: "User points updated successfully" });
    } else {
      res
        .status(400)
        .json({ message: "User can receive bonus once in 24 hours" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}];

exports.isEligible = [isAuthenticated, async (req, res) => {
  try {    
    const { user } = req;

    // Get the current timestamp
    const { lastTokenUpdate } = user;

    // Calculate the timestamp representing 24 hours ago
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

    const isOk = lastTokenUpdate > twentyFourHoursAgo;

    res.status(200).json({ data: { is_ok: isOk } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}];

exports.isRegisteredUser = [isAuthenticated, async (req, res) => {
  try {
    res.status(200).json({ data: { is_ok: true } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}];

exports.bugBounty = [isAuthenticated, hasPlayedGame, async (req, res) => {
  try {
    const { user } = req;

    // Assuming bug bounty reward is 5 points
    user.totalPoints += 5;

    // Save the changes
    await user.save();

    res.status(200).json({ message: "Bug bounty points added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}];
