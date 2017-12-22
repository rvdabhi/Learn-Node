const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
	service: 'Gmail',
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

const generateHTML = (filename, options = {}) => {
	const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
	const inlined = juice(html);
	return inlined;
}

exports.send = async (options) => {
	const html = generateHTML(options.filename, options);
	const text = htmlToText.fromString(html);
	const mailOptions = {
		from: `Rahul Dabhi <rahul.dabhi19@gmail.com>`,
		to: options.user.email,
		subject: options.subject,
		html,
		text
	};

	const sendMail = promisify(transport.sendMail, transport);
	return sendMail(mailOptions);
}

/*transport.sendMail({
	from: 'Rahul Dabhi <rahul.dabhi19@gmail.com',
	to: 'rahul.d@logicaldna.com',
	subject: 'Just trying things out!',
	html: 'hey I <strong> love</strong> you',
	text: 'Hey I **love you**'
});*/
