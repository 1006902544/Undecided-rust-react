const router = require('koa-router')();
router.prefix('/manager');
const multer = require('@koa/multer');
const upload = multer();
const {
  upload: { uploadImage },
} = require('../contoller/manager');

/**
 * @openapi
 * /:
 *   post:
 *     description: upload file
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post('/upload', upload.single('file'), uploadImage);

module.exports = router;
