import mammoth from 'mammoth';

export class WordParser {
  static async parse(file: File): Promise<{ text: string; images: string[] }> {
    const arrayBuffer = await file.arrayBuffer();

    // 提取纯文本
    const textResult = await mammoth.extractRawText({ arrayBuffer });

    // 提取图片（转换为HTML，从中提取img标签）
    const imagesResult = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const buffer = await image.read();
          const base64 = btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          return { src: `data:${image.contentType};base64,${base64}` };
        })
      }
    );

    // 从HTML提取图片src
    const div = document.createElement('div');
    div.innerHTML = imagesResult.value;
    const images = Array.from(div.querySelectorAll('img')).map(img => img.src);

    return { text: textResult.value, images };
  }
}
