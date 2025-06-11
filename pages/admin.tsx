import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasToken, clearToken } from '@/lib/auth';
import Navbar from '@/components/Navbar';


export default function Admin() {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(()=> {
        if (hasToken())setReady(true);
        else router.replace('/login');
    },[router]);

    if (!ready) return null;

    return <h1>Admin board. Only authorized users</h1>

}