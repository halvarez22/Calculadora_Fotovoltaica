import React, { useState, useRef, DragEvent } from 'react';
import { UploadIcon, CheckCircleIcon, ArrowRightIcon, VoltaicIcon } from './Icons';

interface UploadedImage {
  base64: string;
  mimeType: string;
}

interface FileUploadProps {
  onExtract: (front: UploadedImage, back: UploadedImage) => void;
}

interface FileState {
  file: File;
  preview: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove data url prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const FileInputBox: React.FC<{
  id: string;
  label: string;
  fileState: FileState | null;
  onFileChange: (file: File) => void;
}> = ({ id, label, fileState, onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        onFileChange(file);
      } else {
        alert('Por favor, selecciona un archivo de imagen (JPG, PNG, WEBP) o PDF.');
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
          ${isDragging ? 'border-brand-yellow bg-white/10 backdrop-blur-sm' : 'border-neutral-800 bg-white/5 backdrop-blur-sm hover:bg-white/10'}
          ${fileState ? 'border-brand-yellow bg-white/10 backdrop-blur-sm' : ''}
        `}
      >
        {fileState ? (
          <div className="text-center">
            <img src={fileState.preview} alt="Vista previa" className="max-h-40 mx-auto mb-2 rounded" />
            <p className="text-sm text-neutral-300 truncate max-w-xs">{fileState.file.name}</p>
            <div className="flex items-center justify-center mt-2 text-brand-yellow font-semibold">
              <CheckCircleIcon className="w-5 h-5 mr-1" />
              <span>Cargado</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-neutral-300" />
            <p className="mb-2 text-sm text-neutral-300 text-center"><span className="font-semibold">{label}</span> o arrástralo aquí</p>
            <p className="text-xs text-neutral-300/60">JPG, PNG, WEBP o PDF</p>
          </div>
        )}
        <input ref={inputRef} id={id} type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleFileSelect(e.target.files)} />
      </label>
    </div>
  );
};


const FileUpload: React.FC<FileUploadProps> = ({ onExtract }) => {
  const [frontImage, setFrontImage] = useState<FileState | null>(null);
  const [backImage, setBackImage] = useState<FileState | null>(null);

  const handleFileChange = (file: File, side: 'front' | 'back') => {
    const setter = side === 'front' ? setFrontImage : setBackImage;
    setter({ file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) return;

    const frontBase64 = await fileToBase64(frontImage.file);
    const backBase64 = await fileToBase64(backImage.file);

    onExtract(
      { base64: frontBase64, mimeType: frontImage.file.type },
      { base64: backBase64, mimeType: backImage.file.type }
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-xl shadow-xl space-y-8">
        <div className="text-center space-y-4">
            <div className="flex justify-center mb-2">
                <VoltaicIcon className="h-20 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sube tu Recibo de CFE</h2>
            <p className="text-neutral-300">Sube el frente y el reverso de tu recibo para analizarlo con IA de Gemini.</p>
        </div>
      <div className="flex flex-col md:flex-row gap-6">
        <FileInputBox id="front-upload" label="Frente del recibo" fileState={frontImage} onFileChange={(file) => handleFileChange(file, 'front')} />
        <FileInputBox id="back-upload" label="Reverso del recibo" fileState={backImage} onFileChange={(file) => handleFileChange(file, 'back')} />
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!frontImage || !backImage}
          className="flex items-center justify-center bg-brand-yellow text-neutral-950 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-300 disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100 touch-manipulation"
        >
          <span>Analizar Recibo</span>
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default FileUpload;