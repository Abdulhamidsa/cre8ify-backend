import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const generateFriendlyId = (firstName: string): string => {
  const shortId = uuidv4().split('-')[0]; // Use the first part of the UUID
  return `${firstName.toLowerCase().replace(/\s/g, '-')}-${shortId}`;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
