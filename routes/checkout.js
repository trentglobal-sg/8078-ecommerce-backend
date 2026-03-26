const express = require('express');
const checkoutService = require('../services/checkoutService');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT')


const router = express.Router();

router.post('/', [AuthenticateWithJWT], async(req,res) =>{
    console.log(req.userId);
    try {
        const session = await checkoutService.checkout(req.userId);
        res.json(session)
    } catch (e) {
        console.error(e);
        res.status(500).json({
            'error': e
        })
    }
} )

module.exports = router;