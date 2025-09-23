'use client';

import { useEffect, useRef, useState } from 'react';
import ContactModal from '@/components/ContactModal';

declare global {
  interface Window {
    __LZ_CONTACT_PRIMARY?: boolean;
    __LZ_CONTACT_PRIMARY_OWNER?: string;
    openContactSales?: () => void;
  }
}

/**
 * Singleton mount that only renders one ContactModal across the app.
 * No click delegation here. We only expose window.openContactSales()
 * and the modal listens for the 'open-contact' event.
 */
export default function ContactMount() {
  const [isPrimary, setIsPrimary] = useState(false);
  const ownerId = useRef<string>(Math.random().toString(36).slice(2));

  useEffect(() => {
    // Claim the singleton renderer
    if (!window.__LZ_CONTACT_PRIMARY) {
      window.__LZ_CONTACT_PRIMARY = true;
      window.__LZ_CONTACT_PRIMARY_OWNER = ownerId.current;
      setIsPrimary(true);
    }

    // Provide a single global opener
    window.openContactSales = () => {
      window.dispatchEvent(new Event('open-contact'));
    };

    return () => {
      if (window.__LZ_CONTACT_PRIMARY_OWNER === ownerId.current) {
        delete window.__LZ_CONTACT_PRIMARY_OWNER;
        delete window.__LZ_CONTACT_PRIMARY;
      }
      // Keep openContactSales around — harmless if left defined
    };
  }, []);

  return isPrimary ? <ContactModal /> : null;
}