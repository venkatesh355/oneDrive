const express = require('express')
const router = express.Router()
const fileUpload = require('../controller/fileUpload.controller')


router.post('/upload',fileUpload.getUrlCode)
router.get('/myapp',fileUpload.myapp)

module.exports = router;