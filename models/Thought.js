const { Schema, model, Types } = require('mongoose');
const { format } = require('date-fns');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: 'Reaction text required!',
            maxLength: [280, 'Reaction cannot be more than 280 characters!']
        },
        username: {
            type: String,
            required: 'Username required!'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => format(createdAtVal, 'PPPppp')
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: 'Thought text required!',
            minLength: [1, 'Thought must be more than 1 character!'],
            maxLength: [280, 'Thought cannot be more than 280 characters!']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => format(createdAtVal, 'PPPppp')
        },
        username: {
            type: String,
            required: 'Username required!'
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;