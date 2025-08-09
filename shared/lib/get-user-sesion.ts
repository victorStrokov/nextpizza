import { getServerSession } from 'next-auth';
import { authOptions } from '../constants/auth-options';

export const getUserSession = async () => {
  const sesion = await getServerSession(authOptions);

  return sesion?.user ?? null;
};
