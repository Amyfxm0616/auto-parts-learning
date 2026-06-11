export class LocalStorageManager {
  // 检查存储配额
  static checkQuota(): { used: number; available: number; percentage: number } {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    const maxSize = 5 * 1024 * 1024;  // 假设 5MB
    return {
      used: totalSize,
      available: maxSize - totalSize,
      percentage: (totalSize / maxSize) * 100
    };
  }

  // 压缩图片以适应存储空间
  static async compressImage(base64: string, targetSizeKB: number = 400): Promise<string> {
    // 如果已经小于目标大小，直接返回
    const currentSize = (base64.length * 0.75) / 1024;
    if (currentSize <= targetSizeKB) return base64;

    // 创建 Image 对象
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = base64;
    });

    // 动态调整质量
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const quality = Math.max(0.3, targetSizeKB / currentSize);
    return canvas.toDataURL('image/jpeg', quality);
  }

  // 批量压缩图片
  static async compressImages(images: string[], targetSizeKB: number = 400): Promise<string[]> {
    const compressed: string[] = [];
    for (const img of images) {
      try {
        const compressedImg = await this.compressImage(img, targetSizeKB);
        compressed.push(compressedImg);
      } catch (error) {
        console.error('图片压缩失败:', error);
        // 即使压缩失败，也尝试使用原图
        compressed.push(img);
      }
    }
    return compressed;
  }

  // 估算对象占用空间
  static estimateSize(obj: any): number {
    const str = JSON.stringify(obj);
    return str.length;
  }

  // 检查是否有足够空间
  static hasEnoughSpace(estimatedSize: number): boolean {
    const quota = this.checkQuota();
    return quota.available > estimatedSize * 1.2; // 留20%余量
  }
}
