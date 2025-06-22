const express = require('express');
const router = express.Router();
const multer = require('multer');
const reconciliationController = require('../controllers/reconciliationController');

const upload = multer();

router.get('/status', reconciliationController.getReconciliationStatus);
router.post('/run', upload.single('file'), reconciliationController.runFullReconciliation);
router.post('/flag', reconciliationController.flagDiscrepancy);
router.post('/approve', reconciliationController.approveTransaction);
router.post('/export', reconciliationController.exportReport);

module.exports = router;