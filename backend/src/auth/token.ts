import jwt from 'jsonwebtoken';

const generateAccessToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: '10min' });
}

const generateRefreshToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET as string);
}

export {
  generateAccessToken,
  generateRefreshToken
};