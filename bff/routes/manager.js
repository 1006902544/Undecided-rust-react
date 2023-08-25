const router = require('koa-router')();
router.prefix('/manager');
const multer = require('@koa/multer');

const upload = multer();
const {
  upload: { uploadImage },
  material: { deleteMaterialImage, batchDeleteMaterialImage },
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

/**
 * @swagger
 * /manager/material/delete: # 接口地址
 *   delete:
 *     description: 删除图片
 *     parameters: # 请求参数
 *       - name: fileName
 *         description: 文件名
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             status:
 *               type: 'number'
 *             message:
 *               type: 'string'
 */
router.delete('/material/delete', deleteMaterialImage);

/**
 * @swagger
 * /manager/material/batchDelete: # 接口地址
 *   post:
 *     description: 批量删除图片
 *     parameters:
 *       - in: body
 *         name: filenames
 *         required: true
 *         schema:
 *           type: 'object'
 *           properties:
 *             filenames:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             status:
 *               type: 'number'
 *             message:
 *               type: 'string'
 */
router.post('/material/batchDelete', batchDeleteMaterialImage);

module.exports = router;
