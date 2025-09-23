'use client';

import { useEffect, useState } from 'react';
import ContactModal from '@/components/ContactModal';

export default function ContactMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    const closeHandler = () => setOpen(false);

    // Open when any part of the app dispatches 'open-contact'
    window.addEventListener('open-contact' as any, openHandler);
    // Optional: allow others to close it programmatically
    window.addEventListener('close-contact' as any, closeHandler);

    return () => {
      window.removeEventListener('open-contact' as any, openHandler);
      window.removeEventListener('close-contact' as any, closeHandler);
    };
  }, []);

  // If your ContactModal supports onClose, wire it here
  return open ? <ContactModal onClose={() => setOpen(false)} /> : null;
}