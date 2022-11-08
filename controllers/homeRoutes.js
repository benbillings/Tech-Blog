const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {

    }

    catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;