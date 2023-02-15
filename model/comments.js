import mongoose from 'mongoose';
import * as User from './auth.js';
import increment from 'mongoose-sequence';
import { useVirtualId } from './database.js';

const { Schema } = mongoose; // Schema라는 객체로 지정.
const autoIncrement = increment(mongoose);

const commentSchema = new mongoose.Schema(
  {
    commentId: {
      type: Number,
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
    userId: {
      type: Schema.Types.Number,
      ref: 'userInfo',
    },
    nickname: {
      type: Schema.Types.String,
      ref: 'userInfo',
    },
    // userId, nickname 부분 -> 외래키로 불러오기 위해 작성.
  },
  { timestamps: true }
);

commentSchema.plugin(autoIncrement, {
  id: 'commentId',
  inc_field: 'commentId',
});

useVirtualId(commentSchema);
const Comment = mongoose.model('commentInfo', commentSchema);

export async function getAll() {
  return Comment.find().sort({ createdAt: -1 });
}

export async function getById(commentId) {
  return Comment.find({ commentId });
}

export async function create(comment, userId, nickname) {
  return User.findById(userId).then(() => {
    new Comment({
      commentId: Comment.commentId,
      userId,
      nickname,
      comment,
    }).save();
  });
}

export async function update(commentId, comment) {
  return Comment.updateOne(
    { commentId: commentId },
    { $set: { comment: comment } }
  );
}

export async function remove(commentId) {
  return Comment.deleteOne({ commentId: commentId });
}
