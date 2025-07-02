'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import EventForm from '@/components/eventForm';
import { enqueueSnackbar } from 'notistack';

type Event = {
  event_id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  info: string;
  image: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  //const [mode, setMode] = useState<'create' | 'edit' | null>('create');
  const [events, setEvents] = useState<Event[]>([]);
  //const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.replace('/');
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setReady(true));
  }, [router]);
  const [selected, setSelected] = useState<Event | null>(null); // null → create
  const isEditing = Boolean(selected);

  const refresh = () =>
    fetch('/api/all')
      .then(r => r.json())
      .then(setEvents)
      .catch(err => console.error('fetch all', err));

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  const handleCreate = async (data: any) => {
    const ok = await fetch('/api/events/create', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    }).then(r => r.ok);
    ok ? (enqueueSnackbar('Event updated succesfully', {
      variant: 'success',
    }), refresh()) :  enqueueSnackbar('Something went wrong. Please try again.', {
      variant: 'error',
    });
  };

  const handleUpdate = async (data: any) => {
    if (!selected) return;
    const ok = await fetch(`/api/events/${selected.event_id}`, {
      method : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    }).then(r => r.ok);
    ok ? (enqueueSnackbar('Event updated succesfully', {
      variant: 'success',
    }), setSelected(null), refresh())
       :  enqueueSnackbar('Something went wrong. Please try again.', {
        variant: 'error',
      });
  };

  const handleDelete = async (ev: Event) => {
    if (!confirm(`Delete "${ev.name}"?`)) return;
    const ok = await fetch(`/api/events/${ev.event_id}`, { 
      method: 'DELETE' }).then(r => r.ok);
    ok ? (enqueueSnackbar('Event updated succesfully', {
      variant: 'success',
    }),refresh()) : enqueueSnackbar('Something went wrong. Please try again.', {
      variant: 'error',
    });
  };

  if (!ready) return null;

  return (
    <>
  <Navbar cartCount={0} />
  <div style={{ padding: '2rem' }}>
    <h1>Admin Dashboard</h1>

    <h2>Existing Events</h2>
    {events.length === 0 && <p>No events yet.</p>}

    {/* ───── GRID CONTAINER ───── */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {events.map((ev) => (
        <div
          key={ev.event_id}
          style={{
            border: '1px solid #e5e5e5',
            borderRadius: 8,
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ margin: 0 }}>{ev.name}</h3>
          {/* add more info if you like: date, location, image, etc. */}
          <div style={{ marginTop: 'auto' }}>
            <button onClick={() => setSelected(ev)} style={{ marginRight: 8 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(ev)}>Delete</button>
          </div>
        </div>
      ))}
    </div>

    {/* ───── FORM ───── */}
    <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
    <EventForm
      initialData={selected}
      onSubmit={isEditing ? handleUpdate : handleCreate}
    />
    {isEditing && (
      <p>
        <button onClick={() => setSelected(null)}>Cancel edit</button>
      </p>
    )}
  </div>
</>

  );
}