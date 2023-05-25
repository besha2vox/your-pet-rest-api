const express = require('express');
const router = express.Router();

const {
    auth,
    uploadCloud,
    noticeValidation,
    updateNoticeValidation,
    noticesFilter,
} = require('../../middlewares');

const { notices: ctrl } = require('../../controllers');

router.get('/', auth, noticesFilter, ctrl.getUsersNotices);
router.get('/favorites', auth, noticesFilter, ctrl.getFavoriteNotices);

router.post('/favorite/:id', auth, ctrl.addToFavorite);
router.delete('/favorite/:id', auth, ctrl.removeFromFavorite);

router.get('/:category', noticesFilter, ctrl.getByCategory);
router.post(
    '/:category',
    auth,
    uploadCloud.single('pets-photo'),
    noticeValidation,
    ctrl.addNotice
);

router.get('/search/:category', noticesFilter, ctrl.searchByTitle);

router.get('/notice/:id', ctrl.getNoticeById);
router.delete('/notice/:id', auth, ctrl.removeNotice);
router.put(
    '/notice/:id',
    auth,
    uploadCloud.single('pets-photo'),
    updateNoticeValidation,
    ctrl.updateNotice
);

module.exports = router;
