"use client";
import React, { Suspense } from "react";
import Payment from "./Payment";


export default function PaymentPage() {
  return (
    // <Suspense fallback={<div>Loading payment info...</div>}>
    <Suspense>
      <Payment />
    </Suspense>
  );
}
