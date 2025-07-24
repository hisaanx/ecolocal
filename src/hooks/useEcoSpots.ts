// hooks/useEcoSpots.ts
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EcoSpot {
  id: string;
  type: 'recycling' | 'thrift' | 'bike';
  lat: number;
  lng: number;
  name: string;
  description: string;
}

export function useEcoSpots() {
  const [spots, setSpots] = useState<EcoSpot[]>([]);

  useEffect(() => {
    const fetchSpots = async () => {
      const snapshot = await getDocs(collection(db, 'ecoSpots'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as EcoSpot[];
      setSpots(data);
    };

    fetchSpots();
  }, []);

  return spots;
}
