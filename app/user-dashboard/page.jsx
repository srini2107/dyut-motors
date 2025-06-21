import React, { Suspense } from "react";
import UserDashBoard from "./UserDashBoard";

export default function ThankYouPage() {
  return (
    // <Suspense fallback={<div>Loading payment info...</div>}>
    <Suspense>
      <UserDashBoard />
    </Suspense>
  );
}
