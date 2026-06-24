"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import Image from "next/image";
import MapPopup from "./MapPopup";
import "../globals.css";

// ─────────────────────────────────────────────
//  Kiểu trạng thái phong bì
// ─────────────────────────────────────────────
type Stage = "closed" | "opening" | "opened";

// ─────────────────────────────────────────────
//  ↓↓ CHỈNH link bản đồ và số điện thoại tại đây ↓↓
// ─────────────────────────────────────────────
const MAP_URL = "https://maps.google.com/?q=Địa+điểm+tổ+chức"; // ← Thay bằng link Google Maps thật
const PHONE_NUMBER = "0901500935";                               // ← Thay bằng số điện thoại thật

// ─────────────────────────────────────────────
//  Dữ liệu 8 con bướm (keyframe + delay + size + màu)
//  ↓ Thêm/bớt phần tử để tăng/giảm số lượng bướm
// ─────────────────────────────────────────────
const BUTTERFLIES = [
  { id: 1, anim: "bf-1", delay: 0, dur: 2.2, size: 30, hue: 0 },
  { id: 2, anim: "bf-2", delay: 80, dur: 2.0, size: 26, hue: 40 },
  { id: 3, anim: "bf-3", delay: 150, dur: 2.4, size: 34, hue: 280 },
  { id: 4, anim: "bf-4", delay: 60, dur: 2.1, size: 28, hue: 320 },
  { id: 5, anim: "bf-5", delay: 220, dur: 2.3, size: 32, hue: 60 },
  { id: 6, anim: "bf-6", delay: 100, dur: 1.9, size: 24, hue: 200 },
  { id: 7, anim: "bf-7", delay: 40, dur: 2.5, size: 22, hue: 150 },
  { id: 8, anim: "bf-8", delay: 180, dur: 2.0, size: 36, hue: 340 },
];

export default function InviteCard() {
  const searchParams = useSearchParams();

  // Lấy tên người nhận từ query ?to=... hoặc dùng mặc định
  const recipientName = searchParams.get("to") || "Tên người nhận";

  const [stage, setStage] = useState<Stage>("closed");
  const [shaking, setShaking] = useState(false);
  const [showButterflies, setShowButterflies] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // ─── Handler bấm/chạm vào phong bì ───
  const handleOpen = useCallback(() => {
    // Chỉ xử lý khi đang ở trạng thái "closed"
    if (stage !== "closed") return;

    // 1. Rung nhẹ phong bì
    setShaking(true);

    // 2. Sau 550ms (hết shake) → chuyển sang opening
    setTimeout(() => {
      setShaking(false);
      setStage("opening");

      // ── Bướm bắt đầu bay ra khi phong bì đang mở ──
      setShowButterflies(true);

      // 3. Sau thêm 850ms → chuyển sang opened
      setTimeout(() => {
        setStage("opened");
      }, 850);

      // 4. Ẩn bướm sau khi tất cả đã bay hết (delay tối đa + duration)
      setTimeout(() => {
        setShowButterflies(false);
      }, 3200);
    }, 550);
  }, [stage]);

  return (
    <main className="invite-page-bg">
      {/* ── Wrapper căn giữa, giữ tỷ lệ 2:3 ── */}
      <div className="card-wrapper">
        <div
          className="card-inner"
          onClick={handleOpen}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          role={stage === "closed" ? "button" : undefined}
          tabIndex={stage === "closed" ? 0 : undefined}
          aria-label={stage === "closed" ? "Bấm để mở thiệp mời" : undefined}
          style={{ cursor: stage === "closed" ? "pointer" : "default" }}
        >
          {/* ══════════════════════════════════════════════════════
              3 layer chồng nhau – luôn trong DOM, opacity transition
              → crossfade mượt, không flash khi mount/unmount
          ══════════════════════════════════════════════════════ */}

          {/* ── LAYER 1: Phong bì đóng ── */}
          <div
            className={`card-image-container ${shaking ? "envelope-shake" : ""}`}
            style={{
              opacity: stage === "closed" ? 1 : 0,
              transition: "opacity 0.45s ease",
              zIndex: stage === "closed" ? 2 : 1,
              pointerEvents: stage === "closed" ? "auto" : "none",
            }}
          >
            <Image
              src="/closed.png"
              alt="Phong bì đóng"
              fill
              priority
              sizes="(max-width: 480px) 95vw, 480px"
              style={{ objectFit: "contain" }}
              draggable={false}
            />
            <div className="tap-hint pulse-hint">
              <span>✉ Bấm để mở thiệp</span>
            </div>
          </div>

          {/* ── LAYER 2: Đang mở phong bì ── */}
          <div
            className="card-image-container"
            style={{
              opacity: stage === "opening" ? 1 : 0,
              transition: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: stage === "opening" ? 2 : 1,
            }}
          >
            <Image
              src="/opening.png"
              alt="Phong bì đang mở"
              fill
              priority
              sizes="(max-width: 480px) 95vw, 480px"
              style={{ objectFit: "contain" }}
              draggable={false}
            />
          </div>

          {/* ── LAYER 3: Thiệp đã mở ── */}
          <div
            className="card-image-container"
            style={{
              opacity: stage === "opened" ? 1 : 0,
              transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: stage === "opened" ? 2 : 1,
            }}
          >
            <Image
              src="/opened-bg.png"
              alt="Thiệp mời tốt nghiệp"
              fill
              priority
              sizes="(max-width: 480px) 95vw, 480px"
              style={{ objectFit: "contain" }}
              draggable={false}
            />

            {/* Tên + nút chỉ mount khi opened để animation entry hoạt động đúng */}
            {stage === "opened" && (
              <>
                {/*
                 * ── Tên người nhận ──────────────────────────
                 * Chỉnh top (%) để di chuyển lên/xuống trên ảnh
                 * ──────────────────────────────────────────── */}
                <div
                  className="recipient-name name-slide-up"
                  style={{
                    top: "71.5%",
                    left: "10%",
                    right: "10%",
                    fontSize: "clamp(22px, 6.5vw, 33px)",
                  }}
                >
                  {recipientName}
                </div>

                {/*
                 * ── Hai nút Sơ đồ + Điện thoại ──────────────
                 * Chỉnh top (%) cho khớp vị trí dưới địa chỉ
                 * ──────────────────────────────────────────── */}
                <div
                  className="action-buttons name-slide-up"
                  style={{
                    top: "91%",
                    left: "8%",
                    right: "8%",
                  }}
                >
                  <button
                    onClick={() => setShowMap(true)}
                    className="action-btn btn-map"
                    aria-label="Xem sơ đồ đường đi"
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Sơ đồ
                  </button>

                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="action-btn btn-phone"
                    aria-label={`Gọi ${PHONE_NUMBER}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
                    </svg>
                    {PHONE_NUMBER}
                  </a>
                </div>
              </>
            )}
          </div>

        </div>{/* end card-inner */}

        {/* ══════════════════════════════════════════
            BƯỚM BAY — nằm ngoài card-inner (không bị
            clip bởi overflow:hidden) nhưng trong
            card-wrapper để có reference position đúng.
        ══════════════════════════════════════════ */}

        {showButterflies && (
          <div className="butterflies-anchor" aria-hidden="true">
            {BUTTERFLIES.map((bf) => (
              <div
                key={bf.id}
                className="butterfly-wrap"
                style={{
                  animationName: bf.anim,
                  animationDuration: `${bf.dur}s`,
                  animationDelay: `${bf.delay}ms`,
                }}
              >
                {/*
                 * ── CHỈNH bướm ──────────────────────────
                 * size: kích thước emoji (px)
                 * hue-rotate: đổi màu bướm (0-360deg)
                 * wing-flutter duration: tốc độ vỗ cánh
                 * ──────────────────────────────────────── */}
                <span
                  className="butterfly-inner"
                  style={{
                    fontSize: `${bf.size}px`,
                    filter: `hue-rotate(${bf.hue}deg) saturate(1.5) brightness(1.1)`,
                    animationDuration: `${0.22 + bf.id * 0.02}s`,
                  }}
                >
                  🦋
                </span>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* ── Map Popup ── */}
      {showMap && <MapPopup onClose={() => setShowMap(false)} />}

      <style jsx>{`
        /* ─── Background ngoài thiệp: pattern gấu bông ─── */
        :global(.invite-page-bg) {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          /* Pattern gấu bông tile lặp lại */
          background-color: #fce4ec;
          background-image: url('/bg-pattern.png');
          background-repeat: repeat;
          background-size: 340px 340px;
          /* Overlay mờ nhẹ để thiệp nổi hơn */
          position: relative;
        }

        /* Lớp overlay nhẹ phủ lên pattern cho đẹp */
        :global(.invite-page-bg::before) {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(252, 228, 236, 0.18);
          pointer-events: none;
          z-index: 0;
        }

        /* ─── Wrapper căn giữa, giới hạn chiều rộng ─── */
        :global(.card-wrapper) {
          width: 100%;
          max-width: 460px; /* ← CHỈNH max-width của thiệp trên desktop */
          position: relative;
          z-index: 1;
          /* QUAN TRỌNG: cho phép bướm bay ra ngoài khung */
          overflow: visible;
        }

        /* ─── Container giữ tỷ lệ 2:3 ─── */
        :global(.card-inner) {
          width: 100%;
          aspect-ratio: 2 / 3;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          /* Shadow để trông như card thật */
          box-shadow: 0 20px 60px rgba(183, 100, 120, 0.25),
            0 8px 24px rgba(183, 100, 120, 0.15),
            0 2px 8px rgba(183, 100, 120, 0.1);
          /* Smooth shadow khi hover */
          transition: box-shadow 0.3s ease;
        }

        :global(.card-inner:hover) {
          box-shadow: 0 28px 72px rgba(183, 100, 120, 0.32),
            0 12px 32px rgba(183, 100, 120, 0.2),
            0 4px 12px rgba(183, 100, 120, 0.12);
        }

        /* ─── Ảnh thiệp phủ full container ─── */
        :global(.card-image-container) {
          position: absolute;
          inset: 0;
        }

        /* ─── Gợi ý bấm mở ─── */
        :global(.tap-hint) {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(215, 125, 148, 0.35);
          border-radius: 999px;
          padding: 6px 18px;
          font-size: clamp(11px, 2.5vw, 14px);
          color: #c06078;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }

        /* ─── Tên người nhận ─── */
        :global(.recipient-name) {
          position: absolute;
          text-align: center;

          /*
           * ── FONT ────────────────────────────────────────────────────
           * Dùng "Great Vibes" (script/cursive được Google Fonts load),
           * fallback về cursive rồi italic serif
           * ─────────────────────────────────────────────────────────── */
          font-family: var(--font-great-vibes), "Great Vibes", cursive, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;

          /*
           * ── MÀU CHỮ ─────────────────────────────────────────────────
           * Màu hồng #d77d94, có thể đổi thành #b85c76 nếu muốn đậm hơn
           * ─────────────────────────────────────────────────────────── */
          color: #d77d94;

          /*
           * ── WORD WRAP: tự xuống dòng nếu tên dài ───────────────── */
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          line-height: 1.25;

          /* Bóng chữ nhẹ để chữ nổi lên trên ảnh */
          text-shadow: 0 2px 12px rgba(215, 125, 148, 0.4),
            0 0 6px rgba(255, 255, 255, 0.6);

          /* Không cho chọn chữ */
          user-select: none;
          pointer-events: none;
        }

        /* ─── Hai nút bên trong ảnh – position absolute như tên người nhận ─── */
        :global(.action-buttons) {
          /* QUAN TRỌNG: absolute để neo vào card-image-container */
          position: absolute;
          display: flex;
          gap: clamp(6px, 1.5vw, 12px);
          justify-content: center;
          /* left/right/top được đặt inline (chỉnh trong JSX) */
        }

        :global(.action-btn) {
          display: flex;
          align-items: center;
          gap: clamp(4px, 1vw, 8px);
          padding: clamp(5px, 1.2vw, 9px) clamp(10px, 2.5vw, 18px);
          border-radius: 999px;
          font-size: clamp(9px, 2.2vw, 13px);
          font-weight: 700;
          letter-spacing: 0.03em;
          text-decoration: none;
          cursor: pointer;
          /* reset <button> defaults */
          border: 1.5px solid transparent;
          outline: none;
          font-family: inherit;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          backdrop-filter: blur(10px);

          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid transparent;
          white-space: nowrap;
          user-select: none;
        }

        :global(.action-btn svg) {
          /* ↓ CHỈNH kích thước icon */
          width: clamp(10px, 2vw, 15px);
          height: clamp(10px, 2vw, 15px);
          flex-shrink: 0;
        }

        :global(.action-btn:hover) {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 18px rgba(183, 100, 120, 0.35);
        }

        :global(.action-btn:active) {
          transform: translateY(0) scale(0.98);
        }

        /* Nút Sơ đồ: nền trắng mờ, chữ hồng đậm */
        :global(.btn-map) {
          background: rgba(255, 255, 255, 0.88);
          border-color: rgba(215, 125, 148, 0.45);
          color: #b85470;
          box-shadow: 0 3px 12px rgba(183, 100, 120, 0.18);
        }

        /* Nút Điện thoại: nền hồng gradient, chữ trắng */
        :global(.btn-phone) {
          background: linear-gradient(135deg, #e8879a 0%, #d05070 100%);
          border-color: rgba(208, 80, 112, 0.25);
          color: #fff;
          box-shadow: 0 3px 12px rgba(208, 80, 112, 0.38);
        }
      `}</style>
    </main>
  );
}
