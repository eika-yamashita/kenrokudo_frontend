import { useId, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { adminStyles } from '../../../shared/ui/admin';

type Props = {
  files: File[];
  previews: string[];
  primaryIndex: number;
  onFilesChange: (files: File[]) => void;
  onPrimaryIndexChange?: (index: number) => void;
};

const UploadIllustration = () => (
  <svg
    className={adminStyles.uploadIllustration}
    viewBox="0 0 160 120"
    role="img"
    aria-label="画像アップロード"
  >
    <rect x="10" y="22" width="140" height="88" rx="14" fill="#f4f7ff" stroke="#c9d7f7" />
    <path d="M44 82h72" stroke="#9aa8c8" strokeWidth="6" strokeLinecap="round" />
    <path d="M80 74V40" stroke="#4d6cb5" strokeWidth="8" strokeLinecap="round" />
    <path d="m62 56 18-18 18 18" fill="none" stroke="#4d6cb5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
    <circle cx="41" cy="38" r="10" fill="#dce7ff" stroke="#b4c6f3" />
  </svg>
);

export const ImageUploadPicker = ({ files, previews, primaryIndex, onFilesChange, onPrimaryIndexChange }: Props) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileList = (fileList: FileList | null) => {
    onFilesChange(Array.from(fileList ?? []));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileList(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    handleFileList(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setIsDragActive(false);
  };

  const handleOpenPicker = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenPicker();
    }
  };

  return (
    <div className={adminStyles.panel}>
      <h2>画像アップロード</h2>
      <input
        id={inputId}
        ref={inputRef}
        className={adminStyles.visuallyHiddenInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
      />
      <div
        className={`${adminStyles.uploadDropzone} ${isDragActive ? adminStyles.uploadDropzoneActive : ''}`}
        role="button"
        tabIndex={0}
        onClick={handleOpenPicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-controls={inputId}
        aria-label="画像をアップロード"
      >
        <UploadIllustration />
        <p className={adminStyles.uploadTitle}>画像をドラッグ&ドロップ</p>
        <p className={adminStyles.uploadSubTitle}>またはクリックして選択（JPG / PNG / WEBP）</p>
      </div>

      {files.length > 0 ? (
        <div className={adminStyles.selectedImages}>
          <p className={adminStyles.uploadSelectionTitle}>選択中の画像</p>
          {files.map((file, index) => (
            <label key={`${file.name}-${index}`} className={adminStyles.imageRow}>
              {onPrimaryIndexChange ? (
                <input
                  type="radio"
                  name="primaryImage"
                  checked={primaryIndex === index}
                  onChange={() => onPrimaryIndexChange(index)}
                  aria-label={`メイン画像に設定: ${file.name}`}
                />
              ) : null}
              {previews[index] ? (
                <img className={adminStyles.imagePreview} src={previews[index]} alt={file.name} />
              ) : null}
              <span>{file.name}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
};
