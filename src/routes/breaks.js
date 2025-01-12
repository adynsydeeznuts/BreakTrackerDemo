const express = require('express');
const router = express.Router();
const breaksController = require('../controllers/breaksController');

router.get('/', breaksController.getBreaks);
router.post('/add', breaksController.addBreak);
router.delete('/delete', breaksController.removeBreak);

module.exports = router;
