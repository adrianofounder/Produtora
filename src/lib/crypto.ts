import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para AES-GCM, IV de 16 bytes é o padrão e seguro

/**
 * Retorna a chave de encriptação do ambiente como Buffer.
 * Garante que ela possui o comprimento correto (32 bytes para aes-256-gcm).
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error('Variável de ambiente ENCRYPTION_KEY não está definida.');
  }

  const keyBuffer = Buffer.from(keyHex, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error(`ENCRYPTION_KEY inválida. Esperado 32 bytes em hexadecimal (64 caracteres), mas tem ${keyBuffer.length} bytes.`);
  }

  return keyBuffer;
}

/**
 * Criptografa um token utilizando AES-256-GCM.
 * @param text O token/valor a ser criptografado.
 * @returns String no formato `ivHex:authTagHex:encryptedTextHex`.
 */
export function encryptToken(text: string): string {
  if (!text) return text;

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Armazenamos o IV, AuthTag e o dado Encriptado interpolados perfeitamente
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Descriptografa um token utilizando AES-256-GCM.
 * @param cipherText String criptografada no formato `ivHex:authTagHex:encryptedTextHex`.
 * @returns O token/valor original em texto puro.
 */
export function decryptToken(cipherText: string): string {
  if (!cipherText) return cipherText;

  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    throw new Error('Falha ao descriptografar: string no formato inválido.');
  }

  const [ivHex, authTagHex, encryptedTextHex] = parts;

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedTextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
