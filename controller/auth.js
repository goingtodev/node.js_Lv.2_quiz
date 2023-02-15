import * as authRepository from '../model/auth.js';

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
