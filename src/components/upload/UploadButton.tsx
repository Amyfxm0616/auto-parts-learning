import { useState } from 'react';
import UploadModal from './UploadModal';
import type { Part } from '../../types';

interface UploadButtonProps {
  onPartCreated: (part: Part) => void;
}

export default function UploadButton({ onPartCreated }: UploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center gap-2 font-medium transition-all"
      >
        <span className="text-xl">📤</span>
        <span>一键上传</span>
      </button>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={(part) => {
            onPartCreated(part);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
