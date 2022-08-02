const nodemailer = require("nodemailer");

exports.getIndexPage = (req, res) => {
	console.log(req.session.userID);
	res.status(200).render('index', {
		pageName: 'index'
	});
};

exports.getAboutPage = (req, res) => {
	res.status(200).render('about', {
		pageName: 'about'
	});
};

exports.getRegisterPage = (req, res) => {
	res.status(200).render('register', {
		pageName: 'register'
	});
};

exports.getLoginPage = (req, res) => {
	res.status(200).render('login', {
		pageName: 'login'
	});
};

exports.getContactPage = (req, res) => {
	res.status(200).render('contact', {
		pageName: 'contact'
	});
};

exports.sendEmail = async (req, res) => {
	try {
		const outputMessage = `
	<h1>Message Details: </h1>
	<ul>
		<li>Name: ${req.body.name}</li>
		<li>Email: ${req.body.email}</li>
	</ul>
	<h1>Message:</h1>
	<p>${req.body.message}</p>`;


		let transporter = nodemailer.createTransport({
			host  : "smtp.ethereal.email",
			port  : 587,
			secure: false, // true for 465, false for other ports
			auth  : {
				user: "augusta6@ethereal.email", // generated ethereal user
				pass: "NspSqxfSFERjXrHBcr1", // generated ethereal password
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from   : 'Smart Edu Form" <nxtime.x@gmail.com>', // sender address
			to     : "nxtime.x@gmail.com", // list of receivers
			subject: "Smart Edu New Message", // Subject line
			html   : outputMessage, // html body
		});

		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		req.flash('success', "We Received your message succesfully...");
		res.status(200).redirect('contact');

	} catch (e) {
		req.flash('error', `Error ${e}`);
		res.status(200).redirect('contact');
	}
};