const express = require('express');
const ejs = require('ejs')
const app = express();


//Begin Template Engine
app.set("view engine", "ejs");

// End Template Engine

//Begin Middlewares
app.use(express.static("public"));

//End Middlewares


app.get('/', (req, res) => {
	res.status(200).render('index',{
		pageName: 'index'
	});
});
app.get('/about', (req, res) => {
	res.status(200).render('about',{
		pageName: 'about'
	});
});

const port = 3000;
app.listen(port, () => {
	console.log(`App Start on port ${port}`);
});