const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// for any other routes
router.use((req, res) => {
    res.status(404).json({ message: 'Invalid route!'});
});

module.exports = router;