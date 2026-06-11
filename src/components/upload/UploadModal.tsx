import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Part } from '../../types';
import type { ExtractedPartData, UploadProgress } from '../../types/upload';
import { WordParser } from '../../services/fileParser/wordParser';
import { PDFParser } from '../../services/fileParser/pdfParser';
import { ImageParser } from '../../services/fileParser/imageParser';
import { KeywordMatcher } from '../../services/nlp/keywordMatcher';
import { LocalStorageManager } from '../../services/storage/localStorageManager';
import ExtractedDataPreview from '../preview/ExtractedDataPreview';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (part: Part) => void;
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    stage: 'parsing',
    progress: 0,
    message: '准备上传...'
  });
  const [extractedData, setExtractedData] = useState<ExtractedPartData | null>(null);
  const [error, setError] = useState<string>('');

  // 处理文件上传
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setError('');

    try {
      // 检查文件大小
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        throw new Error('文件大小超过20MB限制');
      }

      let text = '';
      let images: string[] = [];

      // 根据文件类型解析
      setProgress({ stage: 'parsing', progress: 20, message: '正在解析文件...' });

      if (file.name.endsWith('.docx')) {
        const result = await WordParser.parse(file);
        text = result.text;
        images = result.images;
      } else if (file.name.endsWith('.pdf')) {
        const result = await PDFParser.parse(file);
        text = result.text;
        images = result.images;
      } else if (file.type.startsWith('image/')) {
        const result = await ImageParser.parse(file, (prog) => {
          setProgress({ stage: 'parsing', progress: 20 + prog * 0.3, message: 'OCR识别中...' });
        });
        text = result.text;
        images = [result.image];
      } else {
        throw new Error('不支持的文件格式');
      }

      // 提取数据
      setProgress({ stage: 'extracting', progress: 50, message: '正在提取信息...' });

      const partName = KeywordMatcher.extractPartName(text);
      const description = KeywordMatcher.extractDescription(text);
      const { names: materialNames, ids: materialIds } = KeywordMatcher.matchMaterials(text);
      const technicalParams = KeywordMatcher.extractTechnicalParams(text);

      // 匹配系统
      setProgress({ stage: 'matching', progress: 70, message: '正在匹配系统...' });
      const { system, confidence } = KeywordMatcher.matchSystem(text);

      // 压缩图片
      setProgress({ stage: 'compressing', progress: 80, message: '正在压缩图片...' });
      const compressedImages = await LocalStorageManager.compressImages(images.slice(0, 5), 300);

      // 组装提取的数据
      const extracted: ExtractedPartData = {
        name: partName || '未命名零部件',
        description: description || '',
        materials: materialNames,
        materialIds: materialIds,
        images: compressedImages,
        technicalParams,
        suggestedSystem: system,
        confidence
      };

      setProgress({ stage: 'complete', progress: 100, message: '处理完成！' });
      setExtractedData(extracted);

    } catch (err: any) {
      console.error('文件处理失败:', err);
      setError(err.message || '文件处理失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 配置拖拽上传
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: false,
    disabled: uploading
  });

  // 确认并保存
  const handleConfirm = (finalData: ExtractedPartData) => {
    // 生成新的Part对象
    const newPart: Part = {
      id: `part-${Date.now()}`,
      name: finalData.name,
      category: finalData.suggestedSystem || '未分类',
      subcategory: finalData.suggestedSubcategory,
      materials: finalData.materialIds,
      imageUrl: finalData.images[0], // 使用第一张图片
      description: finalData.description,
      workingConditions: finalData.technicalParams
    };

    onSuccess(newPart);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">📤 一键上传零部件</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={uploading}
          >
            ×
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {!extractedData ? (
            <>
              {/* 上传区域 */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : uploading
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-6xl mb-4">📄</div>
                {uploading ? (
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-gray-700">{progress.message}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">{Math.round(progress.progress)}%</p>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {isDragActive ? '松开鼠标上传文件' : '拖拽文件到这里，或点击选择文件'}
                    </p>
                    <p className="text-sm text-gray-500">
                      支持格式：Word (.docx)、PDF、图片 (JPG/PNG)
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      最大文件大小：20MB
                    </p>
                  </>
                )}
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              {/* 功能说明 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">✨ 智能识别功能</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 自动提取零部件名称和描述</li>
                  <li>• 识别材料信息并匹配到材料库</li>
                  <li>• 提取技术参数（温度、压力、负载等）</li>
                  <li>• 智能匹配系统和子专业分类</li>
                  <li>• 提取文档中的图片并自动压缩</li>
                </ul>
              </div>
            </>
          ) : (
            /* 数据预览和编辑 */
            <ExtractedDataPreview
              data={extractedData}
              onConfirm={handleConfirm}
              onCancel={() => setExtractedData(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
