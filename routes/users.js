const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT')

/**
 * req.body must be the following:
 * {
 *   "name":string,
 *   "email":string,
 *   "password": string,
 *   "salutation": string,
 *   "marketingPreferences":[string]
 *   "country:[string]
 * }
 */
router.post('/register', async (req, res) => {

    try {
        const userId = await userService.registerUser(req.body);
        res.status(201).json({
            'message': 'User has been created successful',
            'userId': userId
        })
    } catch (e) {
        res.status(500).json({
            'error': e
        })
    }

});

/**
 * req.body must contain:
 * {
 *    "email":string,
 *    "password": string
 * }
 */
router.post('/login', async (req, res) => {
    try {
        const {
            email, password
        } = req.body

        const user = await userService.loginUser(email, password);
        if (user) {
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET)
            res.json({
                'message': "Login successful",
                token
            })
        } else {
            res.status(400).json({
                'message': "Invalid credientials or user not found"
            })
        }

    } catch (e) {
        res.status(500).json({
            'error': e
        })
    }

})

 /** 
 * {
 *   "name":string,
 *   "email":string,
 *   "password": string,
 *   "salutation": string,
 *   "marketingPreferences":[string]
 *   "country:[string]
 * }
 * */
router.put('/me', AuthenticateWithJWT, async (req, res) => {
    try {
        await userService.updateUserDetails(1, req.body);
        res.json({
            'message':'User has been updated successfully'
        })
    } catch (e) {
        console.log(e);
        res.json({
            error: e
        })
    }
  
})

router.get('/me', AuthenticateWithJWT, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userService.getUserDetailsById(userId);
        res.json({
            user
        })
    } catch (e){
        res.status(500).json({
            error: e
        })
    }
})

router.delete('/me', AuthenticateWithJWT, async (req, res) => {
    try {
        await userService.deleteUserAccount(req.userId);
        res.json({
            'message':"User has been deleted successfully!"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message:"Failed to delete user with id " + req.userId
        })
    }
  
})

module.exports = router;