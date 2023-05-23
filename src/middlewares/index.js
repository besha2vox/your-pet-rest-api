const validation = require('./validation');
const ctrlWrapper = require('./ctrlWrapper');
const isValidId = require('./isValidId');
const auth = require('./auth');
const uploadCloud = require('./uploadCloud');
const noticesFilter = require('./noticesFilter');

const {
    noticeValidation,
    updateNoticeValidation,
} = require('./noticeJoiValidation');
const {
    registerSchema,
    loginSchema,
    refreshSchema,
    updateUserSchema,
    emailSchema,
    updateStatusSchema,
} = require('./userJoiValidation');

module.exports = {
    validation,
    ctrlWrapper,
    isValidId,
    auth,
    noticesFilter,
    uploadCloud,
    noticeValidation,
    updateNoticeValidation,
    registerSchema,
    loginSchema,
    refreshSchema,
    updateUserSchema,
    emailSchema,
    updateStatusSchema,
};
