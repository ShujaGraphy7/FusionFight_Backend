// controllers/userController.js

const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username walletAddress wonMatches lostMatches totalMatches totalPoints lastTokenUpdate');
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, walletAddress } = req.body;

    // Check if a user with the same wallet address already exists
    const existingUser = await User.findOne({ walletAddress });

    if (existingUser) {
      // If a user with the same wallet address exists, throw an error
      return res.status(400).json({ message: 'User with this wallet address already exists' });
    }

    // Create a new user
    const newUser = new User({
      username,
      walletAddress,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateWonMatch = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Increment the wonMatches and totalMatches counters for the specified user
    await User.findOneAndUpdate({ walletAddress }, { $inc: { wonMatches: 1, totalMatches: 1, totalPoints:2 } });

    res.status(200).json({ message: 'Won match updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateLostMatch = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Increment the lostMatches and totalMatches counters for the specified user
    await User.findOneAndUpdate({ walletAddress }, { $inc: { lostMatches: 1, totalMatches: 1 } });

    res.status(200).json({ message: 'Lost match updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Fetch user details based on wallet address
    const userDetails = await User.findOne({ walletAddress }, 'username walletAddress wonMatches lostMatches totalMatches totalPoints lastTokenUpdate');

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserPoints = async (req, res) => {
  try {
    // Get the current timestamp
    const currentTime = Date.now();

    // Find all users
    const allUsers = await User.find({}, 'walletAddress totalPoints lastTokenUpdate totalPoints');

    // Update points for each user
    for (const user of allUsers) {
      const { walletAddress, lastTokenUpdate } = user;

      // Calculate time difference in hours
      const timeDifferenceHours = (currentTime - lastTokenUpdate) / (1000 * 60 * 60);

      // Update total points every 24 hours
      if (timeDifferenceHours >= 24) {
        await User.findOneAndUpdate(
          { walletAddress },
          { $inc: { totalPoints: 5 }, lastTokenUpdate: currentTime }
        );
      }
    }

    res.status(200).json({ message: 'User points updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};