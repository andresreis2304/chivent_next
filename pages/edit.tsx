'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EventForm from '@/components/eventForm';
import Navbar from '@/components/Navbar';
import { enqueueSnackbar } from 'notistack';

export default function EditPage() {
  const router = useRouter();
  const { event_id } = router.query;

  const [ready, setReady] = useState(false);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.role !== 'admin') {
          router.replace('/unathorized');
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setReady(true));
  }, [router]);

  useEffect(() => {
    if (!event_id) return;
    fetch(`/api/events/${event_id}`)
      .then(res => res.json())
      .then(setEventData)
      .catch(() => router.replace('/admin'));
  }, [event_id]);

  const handleUpdate = async (form: any) => {
    const res = await fetch(`/api/events/${event_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      enqueueSnackbar('Edit made successfully! 🎉', { variant: 'success' });
      router.push('/admin');
    } else {
      enqueueSnackbar('Edit failed', { variant: 'error' });
    }
  };

  if (!ready || !eventData) return <p>Loading...</p>;

  return (
    <>
      <Navbar cartCount={0} />
      <h1>Edit Event</h1>
      <EventForm initialData={eventData} onSubmit={handleUpdate} />
    </>
  );
}
