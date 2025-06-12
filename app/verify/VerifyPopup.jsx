'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerifyPopup() {
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!mobile) router.push('/');
  }, [mobile, router]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Login successful');
      router.push('/home');
    } else {
      alert(data.error || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Verify OTP for +91 {mobile}</h3>
      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        placeholder="Enter 6-digit OTP"
      />
      <br />
      <button onClick={handleSubmit} disabled={loading || otp.length !== 6}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
}