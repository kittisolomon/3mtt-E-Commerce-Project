const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');


async function registerUser (req, res) {
	const {fullname, gender, email, phone_no, country, address, password} = req.body;

	emailExist = User.findOne({email});
	if(emailExist) {
		throw new CustomError.BadRequestError(`${email} Already Exist!!!`);
	}

	 // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
	
	const user = User.create({
		fullname,
		gender,
		email,
		phone_no,
		country,
		address,
		postal_code,
		password
	});

	const  tokenUser =  createTokenUser(user);
	attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

async function loginUser(req, res) {

	  const { email, password } = req.body;

	  if (!email || !password) {
	    throw new CustomError.BadRequestError('Please provide Email and Password');
	  }

	  const user = await User.findOne({ email });
	  const passwordCorrect = await user.comparePassword(password);

	  if (!user && !passwordCorrect) {
	    throw new CustomError.UnauthenticatedError('Invalid User Credentials!!!');
	  }

	 const tokenUser = createTokenUser(user);
	 attachCookiesToResponse({ res, user: tokenUser });

	 res.status(StatusCodes.OK).json({ user: tokenUser });
}

async function logout(req, res) {

	 res.cookie('token', 'logout', {
     httpOnly: true,
     expires: new Date(Date.now() + 1000)
    });

    res.status(StatusCodes.OK).json({ msg: 'You have been logged out!' });
}