import React, { Suspense } from "react";
import ThankYou from "./ThankYou";

export default function ThankYouPage() {
  return (
    // <Suspense fallback={<div>Loading payment info...</div>}>
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}
