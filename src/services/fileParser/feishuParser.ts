import axios from 'axios';

export class FeishuParser {
  static async parse(docUrl: string, accessToken: string): Promise<{ text: string; images: string[] }> {
    // 提取文档ID
    const docId = this.extractDocId(docUrl);
    if (!docId) throw new Error('无效的飞书文档链接');

    try {
      // 调用飞书 API
      const response = await axios.get(
        `https://open.feishu.cn/open-apis/docx/v1/documents/${docId}/raw_content`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );

      // 简化处理：提取所有文本内容
      const content = JSON.stringify(response.data.data.content);
      return { text: content, images: [] };
    } catch (error: any) {
      // 降级：提示用户导出为 Word
      throw new Error('飞书 API 调用失败，建议先导出为 Word 文档后上传');
    }
  }

  private static extractDocId(url: string): string {
    const match = url.match(/\/doc[sx]?\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : '';
  }
}
