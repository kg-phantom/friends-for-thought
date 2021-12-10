const { Thought, User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find()
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(deletedUser => {
                if(!deletedUser) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                return deletedUser;
            })
            .then(({ username }) => {
                Thought.deleteMany({ username: username })
                    .then(({ deletedCount }) => {
                        res.json({ message: `User ${username} and ${deletedCount} associated thought(s) deleted!`});
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOne({ _id: params.friendId })
            .then(dbFriendData => {
                if(!dbFriendData) {
                    res.status(404).json({ message: 'Cannot add a friend that does not exist!' });
                    return;
                }

                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { friends: dbFriendData } },
                    { new: true, runValidators: true }
                )
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;