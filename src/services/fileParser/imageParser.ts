import Tesseract from 'tesseract.js';
import imageCompression from 'browser-image-compression';

export class ImageParser {
  static async parse(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ text: string; image: string }> {
    // 压缩图片
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    });

    // 转换为 Base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(compressed);
    });

    // OCR 识别
    const { data: { text } } = await Tesseract.recognize(
      compressed,
      'chi_sim+eng',  // 中英文混合
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress * 100);
          }
        }
      }
    );

    return { text, image: base64 };
  }
}
