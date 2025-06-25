'use client';
import React from 'react';

type UploadFormProps = {
  onAdd: (uploadedImages: { url: string; name: string; size: number }[]) => void;
};

export default function UploadForm({ onAdd }: UploadFormProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploaded = Array.from(files).map(file => ({
      url: URL.createObjectURL(file), // temporary preview URL
      name: file.name,
      size: file.size,
    }));

    onAdd(uploaded);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <h3>Upload Image</h3>
      <label style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#86af49', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}>
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
}
