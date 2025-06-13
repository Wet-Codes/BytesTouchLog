const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = {

  
    async Login(req, res) {
        


        try {
            const { username, password } = req.body; // Get username and password from request
            const user = await User.findOne({ where: { username } });
            //console.log('User object:', user); // Log the user object

            //console.log('Password valid:', isPasswordValid); /debbug
            
            if (!user) {
                return res.status(403).send({
                    error: 'Unrecognized Username'
                });
            }  
            //console.log('Comparing password:', password); // Log the entered password
            //console.log('Stored hashed password:', user.password);

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                //console.log('Invalid password for user:', username);
                return res.status(403).send({
                    error: 'The username and password do not match'
                });
            }

            //token part
               const token = jwt.sign(
        { id: user.id, role: user.role }, // Remove username from payload
        config.authentication.jwtSecret,
        { expiresIn: config.authentication.expiresIn }
      );

      // Explicit response format
      res.send({
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        token
      });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).send({
        error: 'Login failed',
        ...(process.env.NODE_ENV === 'development' && { debug: err.message })
      });
    }
  },


  async verifyDevPassword(req, res) {
  try {
    
     if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
     const password = String(req.body?.password || '');
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }
    // Validate request input
    if (!req.body.password || typeof req.body.password !== 'string') {
      return res.status(400).json({ error: 'Invalid password format' });
    }
     // Now access the ACTUAL password value
    const cleanPassword = req.body.password.trim();

    // Verify requesting user is dev (case-sensitive)
    if (req.user.username !== 'dev') {
      return res.status(403).json({ error: 'Restricted to dev account' });
    }

    const devUser = await User.findOne({ 
      where: { username: 'dev', role: 'admin' }
    });

    if (!devUser) {
      return res.status(404).json({ error: 'Dev account not configured' });
    }

    // Compare passwords using existing system
    const isValid = await devUser.comparePassword(cleanPassword);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
},

    // Admin-only endpoint to create accounts
async createAccount(req, res) {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Unauthorized' });
    }
    
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        });
        res.status(201).send(newUser);
    } catch (err) {  // <-- Properly name and use the error
        console.error('Account creation error:', err);
        res.status(400).send({ 
            error: 'Account creation failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
},

async deleteAccount(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({ error: 'Account not found' });
    
    await user.destroy();
    res.send({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send({ 
      error: 'Delete failed',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
},
// Toggle account status
async toggleAccountStatus(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({ error: 'Account not found' });
    
    user.isEnabled = !user.isEnabled;
    await user.save();
    
    res.send({
      message: `Account ${user.isEnabled ? 'enabled' : 'disabled'} successfully`,
      isEnabled: user.isEnabled
    });
  } catch (err) {
    console.error('Toggle status error:', err);
    res.status(500).send({ 
      error: 'Update failed',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
},

// Update account details
 async updateAccount(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    console.log(user)
    if (req.body.username) user.username = req.body.username;
    if (req.body.role) user.role = req.body.role;
    if (req.body.password) user.password = req.body.password;
    
    await user.save();
    
    res.send({
      id: user.id,
      username: user.username,
      role: user.role,
      isEnabled: user.isEnabled,
      createdAt: user.createdAt
    });
    
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).send({ 
      error: 'Update failed',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
  },

  async validateToken(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'role', 'isEnabled']
      });
      
      if (!user) {
      return res.status(401).json({ error: 'User not found' });
    } 

      if (!user || !user.isEnabled) {
        return res.status(401).json({ error: 'Invalid account' });
      }

       const userData = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
     'Expires': '0'
    });  

    console.log('User data sent:', JSON.stringify(userData));
    res.json(userData);

    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ error: 'Token validation failed' });
    }
    

  },


 getCurrentUser(req, res) {
    res.json({
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    });
  },

 

  async getAllAccounts(req, res) {
  try {
    const accounts = await User.findAll({
      attributes: ['id', 'username', 'role', 'isEnabled', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.send(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).send({ error: 'Failed to fetch accounts' });
  }
},

async getAccountDetails(req, res) {
  try {
    const account = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'role', 'isEnabled', 'createdAt']
    });
    if (!account) return res.status(404).send({ error: 'Account not found' });
    res.send(account);
  } catch (err) {
    console.error('Error fetching account:', err);
    res.status(500).send({ error: 'Failed to fetch account' });
  }
}
};
