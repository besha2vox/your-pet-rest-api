const jwt = require('jsonwebtoken');

const { User } = require('../db/models');
const { RequestError } = require('../helpers');

const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    try {
        if (bearer !== 'Bearer') {
            throw new RequestError(401, 'Not authorized');
        }
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.tokens.accessToken) {
            throw new RequestError(401, 'Not authorized');
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'invalid signature') {
            error.status = 401;
        }
        next(error);
    }
};

module.exports = auth;
