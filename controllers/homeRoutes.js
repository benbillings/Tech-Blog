const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ['id', 'title', 'post_content', 'date_created'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_content', 'user_id', 'post_id', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });

    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const showPost = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'title', 'post_content', 'date_created'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_content', 'user_id', 'post_id', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!showPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const post = showPost.get({ plain: true });

        res.render('show-post', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/homepage');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/homepage');
        return;
    }

    res.render('signup');
});
  
module.exports = router;