import React, { useState } from 'react';
import './ImageUpload.scss';
import { Icon } from '@iconify/react';

/**
 * ImageUpload Props:
 * - images?: string[] (업로드된 이미지 URL 배열)
 * - onChange?: (images: string[]) => void (이미지 변경 핸들러)
 * - maxImages?: number (최대 이미지 개수)
 * - className?: string (추가 CSS 클래스)
 * - id?: string (요소 ID)
 */

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
        <label htmlFor={`image-input-${id}`} className="upload-label">
          <Icon icon="mdi:image" />
          이미지 추가
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="image-input"
          id={`image-input-${id}`}
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
              <Icon icon="mdi:close" />
            </button>
          </div>
        ))}
        
        {uploadedImages.length < maxImages && (
          <div className="image-placeholder">
            <Icon icon="mdi:plus" />
            <span>이미지 추가</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
