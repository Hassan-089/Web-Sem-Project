require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const connectDB = require('./config/db');
const Product = require('./models/product'); // Import Product model
// Middleware placeholder - creating simple one inline or requiring new file
const superAdminMiddleware = (req, res, next) => next(); // Dummy middleware for now

app.use(
  "/admin", // Changed path to be cleaner
  superAdminMiddleware,
  require("./routes/admin") // New admin route file
);

// Session Configuration
app.use(session({
  secret: 'mysecret', // In production, use process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: require('mongoose').connection }),
  cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}));

// Make cart available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// View engine
app.set('view engine', 'ejs');
connectDB();
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'lab-final-b')]);
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false })); // Ensure parsing for forms
app.use(express.json());

// Routes
app.use('/order', require('./lab-final-b/order'));

// Routes
app.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('home', {
      title: 'Home',
      products,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get('/checkout', (req, res) => {
  res.render('checkout', { title: 'Checkout' });
});
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      title: 'Our Products'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

const PORT = 3000;
app.get('/my-orders', async (req, res) => {
  const email = req.query.email;
  let orders = [];

  if (email) {
    try {
      orders = await require('./models/order').find({ email: email }).sort({ createdAt: -1 });
    } catch (err) {
      console.error(err);
    }
  }

  res.render('my-orders', {
    title: 'My Orders',
    searchedEmail: email,
    orders
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
