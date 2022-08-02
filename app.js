const express        = require('express');
const mongoose       = require('mongoose');
const session        = require('express-session');
const MongoStore     = require('connect-mongo');
const flash          = require('connect-flash');
const methodOverride = require('method-override');
const ejs            = require('ejs');


const pageRoute     = require('./routes/pageRoutes');
const courseRoute   = require('./routes/courseRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const userRoute     = require('./routes/userRoutes');

const app = express();

//Connect DB
mongoose.connect('mongodb://localhost:27017/smartedu-db').then(() => {
	console.log('DB Connection Success');
}).catch((e) => {
	console.log(e);
});

//Begin Template Engine
app.set("view engine", "ejs");
// End Template Engine

//Begin Global variable
global.userIN = null;
//End Global variable

//Begin Middlewares
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true}));
app.use(session({
	secret           : 'my_example_key',
	resave           : false,
	saveUninitialized: true,
	store            : MongoStore.create({mongoUrl: 'mongodb://localhost:27017/smartedu-db'})
}));
app.use(flash());
app.use(((req, res, next) => {
	res.locals.flashMessages = req.flash();
	next();
}));
app.use(methodOverride('_method', {
	methods: ['POST', 'GET']
}));
//End Middlewares

app.use('*', (req, res, next) => {
	userIN = req.session.userID;
	next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
	console.log(`App Start on port ${port}`);
});