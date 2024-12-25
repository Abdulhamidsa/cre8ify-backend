import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

export const generateFriendlyId = (firstName: string): string => {
  const shortId = customAlphabet('1234567890abcdefg', 10)();
  return `${firstName.toLowerCase().replace(/\s/g, '-')}-${shortId}`;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
