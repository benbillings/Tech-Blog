const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const userInfo = await User.findAll({ 
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(userInfo)
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userInfo = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'post_content', 'date_created']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_content', 'date_created'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                }
            ]
        })

        if(!userInfo) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(userInfo);

    } catch(err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const userInfo = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        
        req.session.save(() => {
            req.session.user_id = userInfo.id;
            req.session.username = userInfo.username;
            req.session.logged_in = true;

            res.status(200).json(userInfo);

        })
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userInfo = await User.findOne({ where: { email: req.body.email } });
        if (!userInfo) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again.'});
            return;
        }
        
        const validPassword = await userInfo.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again.'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userInfo.id;
            req.session.logged_in = true;

            res.json({ user: userInfo, message: 'Login successful!' });
        });
    
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;