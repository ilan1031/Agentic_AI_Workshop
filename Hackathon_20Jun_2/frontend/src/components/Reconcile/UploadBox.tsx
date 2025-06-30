import React from 'react';
import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi';

interface UploadBoxProps {
  onFileSelected: (file: File) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelected }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
        onFileSelected(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        onFileSelected(selectedFile);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/json'];
    return validTypes.includes(file.type);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex align-items-center justify-content-center bg-light rounded-circle mb-4" style={{ width: 64, height: 64 }}>
            <FiFileText size={32} color="#6c757d" />
          </div>
          <div className="d-flex align-items-center">
            <span className="fw-medium text-dark text-truncate" style={{ maxWidth: 200 }}>{file.name}</span>
            <button 
              onClick={removeFile}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-center">
            <FiUploadCloud size={48} color="#adb5bd" />
          </div>
          <div className="mt-4">
            <p className="fw-medium text-dark">
              Drag & drop your file here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or
            </p>
            <label className="mt-2 d-inline-block">
              <span className="btn btn-primary btn-sm fw-medium">
                Browse files
              </span>
              <input 
                type="file" 
                className="d-none" 
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls,.json"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Supported formats: CSV, Excel, JSON
          </p>
        </>
      )}
    </div>
  );
};

export default UploadBox;