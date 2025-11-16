const express = require('express');
const router = express.Router();
const convController = require('../controllers/conversations.controller');

router.get('/', convController.getAll);
router.get('/:id', convController.getOne);
router.post('/', convController.create);
router.patch('/:id', convController.update);
router.delete('/:id', convController.remove);
router.put('/:id', convController.replace);


module.exports = router;