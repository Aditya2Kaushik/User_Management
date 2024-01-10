const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const redis = require('redis');
const authenticationMiddleware = require('./middlewares/authenticationMiddleware');
const validationMiddleware = require('./middlewares/validationMiddleware');
const User = require('./models/userModel');

const app = express();
const PORT = 3000;

// const redisClient = redis.createClient({ host: '127.0.0.1', port: 6379 });

// redisClient.on('error', (err) => {
//     console.log('Redis error: ', err);
//   });
  

mongoose.connect('mongodb://127.0.0.1:27017/user_management')
  .then(() => {
    console.log('Connection Open !!');
  })
  .catch(err => {
    console.log('Oh No Error!');
    console.log(err);
  });

app.use(bodyParser.json());

// Middleware to cache user data in Redis
// const cacheUserData = (req, res, next) => {
//     const { userID } = req.params;
//     redisClient.get(userID, (err, data) => {
//       if (err) {
//         console.log('Redis error: ', err);
//         next();
//       } else if (data !== null) {
//         console.log('User data found in Redis cache');
//         res.json(JSON.parse(data));
//       } else {
//         next();
//       }
//     });
//   };

// API: Create new user
app.post('/api/users', validationMiddleware, authenticationMiddleware, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    // Set user data in Redis cache
    // redisClient.set(newUser.userID.toString(), JSON.stringify(newUser));

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// API: Update user by userID
app.put('/api/users/:userID', authenticationMiddleware, async (req, res) => {
  const { userID } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate({ userID: userID }, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

     // Update user data in Redis cache
    //  redisClient.set(updatedUser.userID.toString(), JSON.stringify(updatedUser));

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
});

//include cacheUserData middleware in updating by user id
// API: Get user by userID
app.get('/api/users/:userID', authenticationMiddleware, async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findOne({ userID: userID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err.message });
  }
});

// API: Get all users
app.get('/api/users', authenticationMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err.message });
  }
});

// API: Delete user by userID
app.delete('/api/users/:userID', authenticationMiddleware, async (req, res) => {
  const { userID } = req.params;
  try {
    const deletedUser = await User.findOneAndDelete({ userID: userID });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove user data from Redis cache
    // redisClient.del(userID.toString());
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting user', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
