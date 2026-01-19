/**
 * 生成简易随机 Token（降级备用方案）
 * @param {number} length - Token 长度（默认32位）
 * @returns {string} 生成的 Token
 */
function generateSimpleToken(length: number = 64): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2);
  
  token = (timestamp + randomStr).replace(/\./g, '');
  while (token.length < length) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token.substring(0, length);
}

/**
 * 生成安全的随机 Token（基于 Crypto API）
 * @returns {<string>} 64位安全Token（32字节转16进制）
 */
export function generateSecureToken(): string {
  try {
    // 浏览器环境
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(32); // 生成32字节随机数（256位）
      window.crypto.getRandomValues(array);
      // 转成十六进制字符串，确保每个字节都是两位（补零）
      return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    // Node.js 环境
    else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      // 动态导入 crypto 模块（TS 中需声明类型）
      const crypto = require('crypto');
      return crypto.randomBytes(32).toString('hex');
    } else {
      // 既非浏览器也非Node环境，使用降级方案
      return generateSimpleToken(64);
    }
  } catch (error) {
    console.error('生成Token失败:', error instanceof Error ? error.message : String(error));
    // 降级方案：使用简易方法
    return generateSimpleToken(64);
  }
}