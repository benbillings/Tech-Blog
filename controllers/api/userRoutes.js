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

        res.status(200).json(userInfo)

    } catch(err) {
        res.status(500).json(err);
    }
});



module.exports = router;