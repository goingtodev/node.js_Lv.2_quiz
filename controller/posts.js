import * as postRepository from '../model/posts.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function createPost(req, res) {
  const { title, content } = req.body;
  const token = req.headers.cookie;
  const authToken = token.split('20')[1];
  const decodedToken = jwt.decode(authToken);
}
