const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Pet } = require('../db/models');

const { RequestError } = require('../helpers');
const { controllerWrap, generateToken } = require('../utils/validation');
const { v4: uuidv4 } = require('uuid');

const { REFRESH_SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new RequestError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = uuidv4();
    try {
        const result = await User.create({
            ...req.body,
            password: hashPassword,
            verificationToken,
        });

        const tokens = generateToken(result._id);
        await User.findByIdAndUpdate(result._id, { tokens });

        res.status(201).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: result._id,
                username: result.username,
                email: result.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.message || 'Internal server error',
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new RequestError(400, 'Email or password is wrong');
        }

        // if (!user.verify) {
        //   throw RequestError(401, "Email not verify");
        // }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            throw new RequestError(400, 'Email or password is wrong');
        }

        const tokens = generateToken(user._id);
        await User.findByIdAndUpdate(user._id, { tokens });

        res.status(201).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.message || 'Internal server error',
        });
    }
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const { id } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const user = await User.findById(id);

        if (!user) {
            throw new RequestError(403, 'Invalid token');
        }

        if (refreshToken !== user.tokens.refreshToken) {
            throw new RequestError(403, 'Invalid token');
        }

        const tokens = generateToken(user._id);
        await User.findByIdAndUpdate(user._id, { tokens });

        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.message || 'Internal server error',
        });
    }
};

const getCurrent = async (req, res) => {
    const { _id, username, email } = req.user;
    console.log(req.user);
    res.json({
        id: _id,
        username,
        email,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { accessToken: '', refreshToken: '' });

    res.status(204).json();
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw RequestError(404, 'User not found');
    }

    if (user.verify) {
        throw RequestError(400, 'Verification has already been passed');
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: '',
    });

    res.status(200).json({ message: 'Verification successful' });
};

const getUserInfo = async (req, res) => {
    const { _id } = req.user;
    const userInfo = await User.findById(_id);

    if (!userInfo) {
        throw RequestError(401, 'Not authorized');
    }
    const userPets = await Pet.find({ owner: _id });

    if (!userPets) {
        throw new RequestError(404, `no match for your request`);
    }

    res.status(200).json({
        user: {
            id: userInfo._id,
            firstVisit: userInfo.firstVisit,
            username: userInfo.username,
            email: userInfo.email,
            phone: userInfo.phone,
            city: userInfo.city,
            birthday: userInfo.birthday,
            avatarURL: userInfo.avatarURL,
            pet: userPets,
        },
    });
};

const updateUser = async (req, res, next) => {
    const { _id } = req.user;
    const userData = await req.body;
    const data = req.file
        ? { ...userData, avatarURL: req.file.path }
        : { ...userData };

    const updatedUserData = await User.findByIdAndUpdate(_id, data, {
        new: true,
    });

    if (!updatedUserData) {
        throw new RequestError(400, `Error: user is not updated`);
    }

    next();
    // res.status(200).json({ result: updatedUserData });
};

const updateUserPets = async (req, res) => {
    const { _id: ownerId } = req.user;
    const { id: petId } = req.params;
    if (!req.body) {
        throw new RequestError(422, `there is no body content`);
    }
    const pet = await Pet.findById(petId);
    if (!pet) {
        throw new RequestError(404, `Pet with id: ${petId} is not found`);
    }
    if (pet.owner?.toString() !== ownerId?.toString()) {
        throw new RequestError(
            403,
            `User has no access to update the pet with id  ${petId}`
        );
    }
    const petData = await req.body;
    const data = req.file
        ? { ...petData, avatarURL: req.file.path }
        : { ...petData };

    const updateUserPet = await Pet.findByIdAndUpdate(petId, data, {
        new: true,
    });

    if (!updateUserPet) {
        throw new RequestError(400, `Error: notice is not updated`);
    }

    res.status(200).json({ result: updateUserPet });
};

module.exports = {
    register: controllerWrap(register),
    login: controllerWrap(login),
    refresh: controllerWrap(refresh),
    getCurrent: controllerWrap(getCurrent),
    logout: controllerWrap(logout),
    verify: controllerWrap(verify),
    updateUser: controllerWrap(updateUser),
    getUserInfo: controllerWrap(getUserInfo),
    updateUserPets: controllerWrap(updateUserPets),
};
