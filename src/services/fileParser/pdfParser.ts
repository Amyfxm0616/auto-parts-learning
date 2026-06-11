import * as pdfjsLib from 'pdfjs-dist';

// 配置 PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class PDFParser {
  static async parse(file: File): Promise<{ text: string; images: string[] }> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    const images: string[] = [];

    // 遍历所有页面
    for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {  // 限制最多20页
      const page = await pdf.getPage(i);

      // 提取文本
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';

      // 渲染页面为图片（仅前3页）
      if (i <= 3) {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const context = canvas.getContext('2d')!;

        await page.render({ canvasContext: context, viewport, canvas }).promise;
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        images.push(imageData);
      }
    }

    return { text: fullText, images };
  }
}
