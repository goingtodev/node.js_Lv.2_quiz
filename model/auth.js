import mongoose from 'mongoose';
import { useVirtualId } from './database.js';
import increment from 'mongoose-sequence';

const autoIncrement = increment(mongoose);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      require: true,
    },
    nickname: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: false }
);

userSchema.plugin(autoIncrement, { id: 'userId', inc_field: 'userId' });

useVirtualId(userSchema);

const User = mongoose.model('userInfo', userSchema);

export async function createUser(user) {
  return (
    User.create(user)
      // .save()
      .then((data) => data.userId)
  );
}

export async function findByUsername(nickname) {
  return User.findOne({ nickname });
}

export async function findById(userId) {
  return User.find({ userId });
}
