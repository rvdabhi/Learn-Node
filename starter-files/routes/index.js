const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
// just imported specific function from errorHandlers using {}
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.homePage));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/store/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
