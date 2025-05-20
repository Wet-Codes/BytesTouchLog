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

// Toggle account status
async toggleAccountStatus(req, res) {
    try {
        const user = await User.findByPk(req.params.id);
        user.isEnabled = !user.isEnabled;
        await user.save();
        res.send(user);
    } catch (err) {
    console.error('Toggle status error:', err);
    res.status(400).send({ 
        error: 'Update failed',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}
},

// Update account details
 async updateAccount(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (req.body.newPassword) {
        user.password = req.body.newPassword;
        await user.save(); // Triggers hashPassword hook
      }
      
      if (req.body.username) {
        user.username = req.body.username;
        await user.save();
      }

      res.send(user);
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
    'Cache-Control': 'no-store, max-age=0',
    'Pragma': 'no-cache'
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
  }
};
