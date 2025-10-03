const User = require('../models/User');

const authController = {
  async login(req, res) {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Logged in!', userId: user.id, username: user.username });
  }
};

module.exports = authController;
