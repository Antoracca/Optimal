import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

/** Encrypts high-risk fields before persistence. Keys must be supplied by a KMS-backed secret. */
@Injectable()
export class EncryptionService {
  private readonly key: Buffer;

  constructor() {
    const encodedKey = process.env.DATA_ENCRYPTION_KEY;
    if (!encodedKey) {
      throw new Error('DATA_ENCRYPTION_KEY is required');
    }

    this.key = Buffer.from(encodedKey, 'base64');
    if (this.key.length !== 32) {
      throw new Error('DATA_ENCRYPTION_KEY must be a base64 encoded 32-byte key');
    }
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${ciphertext.toString('base64')}`;
  }

  decrypt(value: string): string {
    const parts = value.split(':');
    if (parts.length !== 4 || parts[0] !== 'v1') {
      throw new InternalServerErrorException('Format de donnée chiffrée invalide');
    }

    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, Buffer.from(parts[1], 'base64'));
      decipher.setAuthTag(Buffer.from(parts[2], 'base64'));
      return Buffer.concat([decipher.update(Buffer.from(parts[3], 'base64')), decipher.final()]).toString('utf8');
    } catch {
      throw new InternalServerErrorException('Impossible de déchiffrer la donnée sensible');
    }
  }

  mask(value?: string | null): string | null {
    if (!value) return null;
    return `••••••••••••••••••••${value.slice(-4)}`;
  }
}
