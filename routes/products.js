const express = require('express');
const router = express.Router();
const productService = require('../services/productService')

router.get("/", async function(req, res){
    try {
        const products = await productService.getAllProducts();
        res.json(products);

    } catch (error) {
        res.status(500).json({
            "message": error.message
        })
    }
});


module.exports = router;