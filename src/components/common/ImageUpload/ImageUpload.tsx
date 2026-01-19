import React, { useRef, useState } from 'react';
import './ImageUpload.scss';

export interface ImageUploadProps {
  images?: string[];
  onChange?: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  id?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onChange,
  maxImages = 5,
  className = '',
  id,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length && uploadedImages.length + newImages.length < maxImages; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const newImageList = [...uploadedImages, ...newImages, event.target.result as string];
            setUploadedImages(newImageList);
            onChange?.(newImageList);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onChange?.(newImages);
  };

  return (
    <div className={`moovy-image-upload ${className}`} id={id}>
      <div className="image-upload-header">
        <label className="form-label">
          <i className="fas fa-image"></i>
          이미지 추가
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="image-input"
          ref={inputRef}
          disabled={uploadedImages.length >= maxImages}
        />
      </div>
      
      <div className="image-preview-grid">
        {uploadedImages.map((image, index) => (
          <div key={index} className="image-preview-item">
            <img src={image} alt={`Uploaded ${index + 1}`} />
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => handleRemoveImage(index)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        
        {uploadedImages.length < maxImages && (
          <div
            className="image-placeholder"
            onClick={() => inputRef.current?.click()}
          >
            <i className="fas fa-plus"></i>
            <span>이미지 추가</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
