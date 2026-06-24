"use client";

import { Suspense } from "react";
import InviteCard from "./InviteCard";

// Bọc bằng Suspense vì InviteCard dùng useSearchParams
export default function InvitePage() {
  return (
    <Suspense fallback={<InvitePageSkeleton />}>
      <InviteCard />
    </Suspense>
  );
}

function InvitePageSkeleton() {
  return (
    <main className="invite-page-bg">
      <div className="card-wrapper">
        <div
          style={{
            width: "100%",
            aspectRatio: "2/3",
            backgroundColor: "#f5e6ea",
            borderRadius: "12px",
          }}
        />
      </div>
    </main>
  );
}
