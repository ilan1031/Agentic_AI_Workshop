const express = require('express');
const router = express.Router();
const multer = require('multer');
const transactionController = require('../controllers/transactionController');

const upload = multer();

router.post('/upload', upload.single('file'), transactionController.uploadBankFeed);
router.get('/', transactionController.getTransactions);
router.post('/match', transactionController.matchTransactions);

module.exports = router;