const express = require('express');
const router = express.Router();

router.post('/register', async (req,res)=>{
    res.json({
        'message':'Register a new user'
    })
})

router.post('/login', async (req,res)=>{
    res.json({
        'message':'Login a user'
    })
})

router.get('/me', async(req,res)=>{
    res.json({
        message:'Getting the profile of the current logged in user'
    })
})

module.exports = router;