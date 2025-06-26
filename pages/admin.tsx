'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import EventForm from '@/components/eventForm';

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
    ok ? (alert('Created'), refresh()) : alert('Create failed');
  };

  const handleUpdate = async (data: any) => {
    if (!selected) return;
    const ok = await fetch(`/api/events/${selected.event_id}`, {
      method : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    }).then(r => r.ok);
    ok ? (alert('Updated'), setSelected(null), refresh())
       :  alert('Update failed');
  };

  const handleDelete = async (ev: Event) => {
    if (!confirm(`Delete "${ev.name}"?`)) return;
    const ok = await fetch(`/api/events/${ev.event_id}`, { method: 'DELETE' })
              .then(r => r.ok);
    ok ? refresh() : alert('Delete failed');
  };

  if (!ready) return null;

  return (
    <>
      <Navbar cartCount={0} />
      <div style={{padding:'2rem'}}>
        <h1>Admin Dashboard</h1>

        <h2>Existing Events</h2>
        {events.length === 0 && <p>No events yet.</p>}
        <ul>
          {events.map(ev => (
            <li key={ev.event_id} style={{marginBottom:4}}>
              {ev.name}{' '}
              <button onClick={() => setSelected(ev)}>Edit</button>{' '}
              <button onClick={() => handleDelete(ev)}>Delete</button>
            </li>
          ))}
        </ul>

        <h2 style={{marginTop:'2rem'}}>
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h2>
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