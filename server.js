const express = require('express');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://bzg:12341234@cluster0.vjb0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  // Create admin user if doesn't exist
  createAdminUser();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

async function createAdminUser() {
  try {
    const adminExists = await User.findOne({ username: 'yelarys' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'yelarys',
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date()
      });
      console.log('Admin user created');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  }
}

// Configure express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

const OPENWEATHER_API_KEY = '35969e08ae6c042dca65746208702818'; 
const MOVIES_API_KEY = 'ef6ec19b59mshe456a56f96330aap170096jsnfd75d5a51584'; 

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  deletedAt: Date
});

const User = mongoose.model('User', userSchema);

// API History Schema
const historySchema = new mongoose.Schema({
  userId: String,
  requestType: String,
  requestData: Object,
  responseData: Object,
  timestamp: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// Auth Middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
};

// Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
});

app.get('/admin', requireAdmin, async (req, res) => {
  const users = await User.find({ deletedAt: null });
  res.render('admin', { users });
});

// Existing routes with added history logging
app.get('/weather', requireAuth, async (req, res) => {
  try {
    const city = req.query.city || 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    
    // Log API request to history
    await new History({
      userId: req.session.user._id,
      requestType: 'weather',
      requestData: { city },
      responseData: response.data
    }).save();
    
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

//Bonus Route (14-day forecast)
app.get('/forecast', requireAuth, async (req, res) => {
  try {
    const city = req.query.city || 'London';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    
    // Log API request to history
    await new History({
      userId: req.session.user._id,
      requestType: 'forecast',
      requestData: { city },
      responseData: response.data
    }).save();
    
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 2. Movies Route
app.get('/movies', requireAuth, async (req, res) => {
  try {
    const title = req.query.title || 'inception';
    const response = await axios.get(`https://moviesdatabase.p.rapidapi.com/titles/search/title/${title}`, {
      headers: {
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
        'X-RapidAPI-Key': MOVIES_API_KEY
      },
      params: {
        exact: false,
        titleType: 'movie'
      }
    });
    
    // Log API request to history
    await new History({
      userId: req.session.user._id,
      requestType: 'movies',
      requestData: { title },
      responseData: response.data
    }).save();
    
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 3. Movie Quotes route
app.get('/movie-quotes', requireAuth, async (req, res) => {
  try {
    const count = req.params.count || 1;
    const response = await axios.get(`https://api.breakingbadquotes.xyz/v1/quotes/${count}`);
    
    // Log API request to history
    await new History({
      userId: req.session.user._id,
      requestType: 'movie-quotes',
      requestData: { count },
      responseData: response.data
    }).save();
    
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Add after existing routes

// Admin routes
app.get('/admin/users', requireAdmin, async (req, res) => {
  const users = await User.find({ deletedAt: null });
  res.render('admin/users', { users });
});

app.post('/admin/users', requireAdmin, async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    username,
    password: hashedPassword,
    isAdmin: !!isAdmin,
    createdAt: new Date()
  });
  res.redirect('/admin/users');
});

app.delete('/admin/users/:id', requireAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
  res.sendStatus(200);
});

// Auth routes
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.render('index', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/movies', requireAuth, (req, res) => {
  res.render('movies', { user: req.session.user });
});

app.get('/movie-quotes', requireAuth, (req, res) => {
  res.render('movie-quotes', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});