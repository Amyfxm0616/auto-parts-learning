export class UploadErrorHandler {
  static handle(error: any): string {
    if (error.name === 'QuotaExceededError') {
      return '存储空间不足！请删除部分图片或降低图片质量。';
    }

    if (error.message?.includes('CORS')) {
      return '跨域请求被阻止，建议导出为 Word/PDF 后上传。';
    }

    if (error.message?.includes('parse') || error.message?.includes('format')) {
      return '文件格式不支持或文件已损坏。';
    }

    if (error.message?.includes('size') || error.message?.includes('大小')) {
      return error.message;
    }

    return `上传失败: ${error.message || '未知错误'}`;
  }
}
