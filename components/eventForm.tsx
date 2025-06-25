'use client';
import { useState } from 'react';
import UploadForm from './UploadForm';

export default function EventForm({ onSubmit, initialData = null }: {
  onSubmit: (data: any) => void;
  initialData?: any;
}) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    date: initialData?.date || '',
    start_time: initialData?.start_time || '',
    end_time: initialData?.end_time || '',
    venue: initialData?.venue || '',
    info: initialData?.info || '',
    image: initialData?.image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = (images: any[]) => {
    if (images.length > 0) {
      setForm(prev => ({ ...prev, image: images[0].url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto' }}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" required />
      <input name="date" value={form.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" required />
      <input name="start_time" value={form.start_time} onChange={handleChange} placeholder="Start Time" required />
      <input name="end_time" value={form.end_time} onChange={handleChange} placeholder="End Time" required />
      <input name="venue" value={form.venue} onChange={handleChange} placeholder="Venue" required />
      <textarea name="info" value={form.info} onChange={handleChange} placeholder="Event Info" required />
      
      <p>Upload Event Image:</p>
      <UploadForm onAdd={handleUpload} />

      <button type="submit">Submit</button>
    </form>
  );
}
