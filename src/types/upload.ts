export type FileType = 'word' | 'pdf' | 'image' | 'feishu';

export interface ExtractedPartData {
  name: string;
  description: string;
  materials: string[];
  materialIds: string[];
  images: string[];
  technicalParams?: {
    temperature?: string;
    pressure?: string;
    load?: string;
    environment?: string;
  };
  suggestedSystem?: string;
  suggestedSubcategory?: string;
  confidence: number;
}

export interface UploadProgress {
  stage: 'parsing' | 'extracting' | 'matching' | 'compressing' | 'complete';
  progress: number;
  message: string;
}
