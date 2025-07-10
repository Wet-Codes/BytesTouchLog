const { HistoryLog, User } = require('../models');
const deviceParser = require('../utils/deviceParser');

module.exports = {
  async recordLogin(userId, ipAddress, device) {
    try {
      // Parse device info
      const deviceInfo = deviceParser(device);
      
      await HistoryLog.create({
        userId,
        action: 'Login',
        ipAddress,
        device: deviceInfo.full
      });
      
      return true; // Success indicator
    } catch (error) {
      console.error('Login recording failed:', error);
      return false; // Failure indicator
    }
  },

async recordLogout(req, res) {
  try {
    const userId = req.user.id;
    const { ip, device } = req.body; // Destructure from request body

    const deviceInfo = deviceParser(device);
    await HistoryLog.create({
      userId,
      action: 'Logout',
      ipAddress: ip, // Use ip string directly
      device: deviceInfo.full
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Logout recording failed:', error);
    res.status(500).send({ error: 'Logout recording failed' });
  }
},
   async getLoginLogs(req, res) {
    try {
      const logs = await HistoryLog.findAll({
         where: {
    action: ['Login', 'Logout'] // ✅ correct usage
  },
        include: [{
          model: User,
          attributes: ['username'],
          as: 'user'
        }],
        order: [['timestamp', 'DESC']]
      });
      
      res.send(logs);
    } catch (error) {
      console.error('Error fetching login logs:', error);
      res.status(500).send({ error: 'Failed to fetch login logs' });
    }
  },

  async getFullSessionLogs() {
    try {
      return await HistoryLog.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['username']
        }],
        order: [['timestamp', 'DESC']]
      });
    } catch (error) {
      console.error('Error fetching session logs:', error);
      return [];
    }
  }
};