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
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new RequestError(400, 'Email or password is wrong');
    }
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
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
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
};

const getCurrent = async (req, res) => {
    const { _id, username, email } = req.user;
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

    const updatedUserData = await User.findByIdAndUpdate(_id, data);

    if (!updatedUserData) {
        throw new RequestError(400, `Error: user is not updated`);
    }

    next();
};

const updateStatus = async (req, res, next) => {
    const { _id: ownerId } = req.user;
    const { firstVisit } = req.body;

    const result = await User.findByIdAndUpdate(
        { _id: ownerId },
        { firstVisit }
    );

    if (!result) {
        throw new RequestError(400, `Error: user is not updated`);
    }

    next();
};

module.exports = {
    register: controllerWrap(register),
    login: controllerWrap(login),
    refresh: controllerWrap(refresh),
    getCurrent: controllerWrap(getCurrent),
    logout: controllerWrap(logout),
    updateUser: controllerWrap(updateUser),
    getUserInfo: controllerWrap(getUserInfo),
    updateStatus: controllerWrap(updateStatus),
};
