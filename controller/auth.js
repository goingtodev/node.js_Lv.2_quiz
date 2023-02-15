import * as authRepository from '../model/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function signup(req, res) {
  const { nickname, password, confirm } = req.body;
  const rex = /^[a-zA-Z0-9]{4,20}$/;
  const nicknameCheck = rex.test(nickname);
  if (!nicknameCheck) {
    return res
      .status(412)
      .json({ errorMessage: '닉네임의 형식이 일치하지 않습니다.' });
  }
  if (password !== confirm) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드가 일치하지 않습니다' });
  }
  if (password.search(nickname) > -1) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다.' });
  }
  const nicknameOverlap = await authRepository.findByUsername(nickname);
  if (nicknameOverlap != null) {
    // != 하면 null, undefined까지 포함, !== 하면 null만.
    return res.status(412).json({ errorMessage: '중복된 닉네임입니다.' });
  }
  await authRepository.createUser({
    nickname,
    password,
  });
  res.status(201).json({ message: '회원 가입에 성공했습니다.' });
}

export async function login(req, res) {
  const { nickname, password } = req.body;
  const user = await authRepository.findByUsername(nickname);

  if (!user) {
    return res.status(412).json({ errorMessage: '패스워드를 확인해주세요.' });
  }
  const isValidPassword = await user.password.includes(password);

  if (!isValidPassword) {
    return res.status(412).json({ errorMessage: '패스워드를 확인해주세요.' });
  }
  const crtoken = createJwtToken(user.userId, user.nickname);
  const slicetoken1 = crtoken.slice(0, 10);
  const slicetoken2 = crtoken
    .slice(10, 20)
    .replace(/^[a-z0-9_]{4,20}$/gi, '**********');
  const token = slicetoken1 + slicetoken2;
  res.cookie('Authorization', `Bearer ${crtoken}`);
  res.json({ token: token });
}

const secretKey = process.env.SECRETKEY;
function createJwtToken(userId, nickname) {
  return jwt.sign({ userId, nickname }, secretKey);
}
