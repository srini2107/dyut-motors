'use client';
import { Suspense } from 'react';
import VerifyPopup from './VerifyPopup';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPopup />
    </Suspense>
  );
}