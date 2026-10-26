/**
 * Làm sạch chuỗi văn bản để chống lỗi XSS.
 * Xóa bỏ toàn bộ các thẻ HTML độc hại, event handlers và script tags.
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Xóa thẻ <script>
    .replace(/on\w+="[^"]*"/gi, '') // Xóa event handlers như onload, onclick
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '') // Xóa javascript: pseudo-protocol
    .replace(/<[^>]*>/g, '') // Stripping toàn bộ thẻ HTML còn lại
    .trim();
}

/**
 * Kiểm tra tính hợp lệ của URL Embed Video.
 * Chỉ cho phép các giao thức HTTPS/HTTP và kiểm tra định dạng URL.
 */
export function isValidEmbedUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    
    // Ngăn chặn javascript:, data:, vbscript: protocols
    if (!allowedProtocols.includes(parsed.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}