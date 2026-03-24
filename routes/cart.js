const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT')

router.get('/', [AuthenticateWithJWT], async(req,res)=>{
    try {
        const cartContents = await cartService.getCartContents(req.userId) 
        res.json(cartContents)
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.put('/', [AuthenticateWithJWT], async (req,res)=>{
    try {
    
        await cartService.updateCart(req.userId, req.body.cartItems)
        
        res.json({
            'message':"Cart updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})

module.exports = router;