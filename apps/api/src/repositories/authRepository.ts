import { prisma } from '../database';
import type { RefreshToken, PasswordResetToken } from '../../generated/prisma/client';

export const authRepository = {
  createRefreshToken: async (data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> => {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken: async (token: string): Promise<RefreshToken | null> => {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  deleteRefreshToken: async (token: string): Promise<void> => {
    await prisma.refreshToken.delete({ where: { token } });
  },

  deleteAllUserRefreshTokens: async (userId: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  },

  // ─── Password Reset ──────────────────────────────────────────────────────────

  createPasswordResetToken: async (data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> => {
    return prisma.passwordResetToken.create({ data });
  },

  findPasswordResetToken: async (token: string): Promise<PasswordResetToken | null> => {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  },

  markPasswordResetTokenUsed: async (token: string): Promise<void> => {
    await prisma.passwordResetToken.update({ where: { token }, data: { used: true } });
  },

  deleteExpiredPasswordResetTokens: async (userId: string): Promise<void> => {
    await prisma.passwordResetToken.deleteMany({
      where: { userId, OR: [{ expiresAt: { lt: new Date() } }, { used: true }] },
    });
  },
};
