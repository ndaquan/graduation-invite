"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// ── Chỉnh link Google Maps tại đây ──
const MAP_LINK = "https://maps.google.com/?q=71+Ngũ+Hành+Sơn+Đà+Nẵng";

interface MapPopupProps {
  onClose: () => void;
}

export default function MapPopup({ onClose }: MapPopupProps) {
  const [closing, setClosing] = useState(false);

  // Đóng bằng phím Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khoá cuộn trang khi popup mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 220);
  }

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="popup-backdrop"
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20, 5, 12, 0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 200,
        }}
      />

      {/* ── Card popup ── */}
      <div
        className={`popup-card${closing ? " closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Sơ đồ địa điểm"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          /* To hơn: chiếm gần hết màn hình */
          width: "min(96vw, 560px)",
          borderRadius: "18px",
          overflow: "hidden",
          background: "#fff",
          boxShadow:
            "0 32px 80px rgba(100, 20, 50, 0.35), 0 8px 24px rgba(100, 20, 50, 0.18)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Nút đóng ── */}
        <button
          onClick={handleClose}
          aria-label="Đóng"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "#8b3252",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
            transition: "transform 0.15s, background 0.15s",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          ✕
        </button>

        {/* ── Ảnh map hiển thị đầy đủ ── */}
        <div style={{ position: "relative", width: "100%" }}>
          <Image
            src="/map.png"
            alt="Sơ đồ địa điểm"
            width={1200}
            height={900}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
            priority
            draggable={false}
          />
        </div>

        {/* ── Nút Google Maps ── */}
        <div
          style={{
            padding: "14px 20px",
            background: "#fff",
          }}
        >
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 0",
              borderRadius: 999,
              background: "linear-gradient(135deg, #e8879a 0%, #c94d6e 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "clamp(13px, 3vw, 15px)",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(201, 77, 110, 0.4)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 8px 26px rgba(201, 77, 110, 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 4px 18px rgba(201, 77, 110, 0.4)";
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 17, height: 17 }}
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Mở Google Maps
          </a>
        </div>
      </div>
    </>
  );
}
