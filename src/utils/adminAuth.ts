const ADMIN_TOKEN = 'quiz2026';
const STORAGE_KEY = 'quiz_admin';

/** 检查 URL 中是否有管理员 token，有则写入 localStorage */
export function checkAndStoreAdminToken(searchParams: URLSearchParams): void {
  if (searchParams.get('admin') === ADMIN_TOKEN) {
    localStorage.setItem(STORAGE_KEY, '1');
  }
}

/** 当前会话是否有管理员权限 */
export function isAdmin(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1';
}
