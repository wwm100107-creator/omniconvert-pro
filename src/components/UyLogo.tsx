import React from 'react';

interface UyLogoProps {
  className?: string;
  size?: number;
}

export const UyLogo: React.FC<UyLogoProps> = ({ className = 'w-9 h-9', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Khung nền tối giản phong cách minimalism */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#0b0f19"
        stroke="#1e293b"
        strokeWidth="1.5"
      />

      {/* Đường nét chính: Chữ U tối giản tượng trưng cho Uy */}
      <path
        d="M32 28 V56 C32 65.9411 40.0589 74 50 74 C59.9411 74 68 65.9411 68 56 V34"
        stroke="#f8fafc"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mũi tên chuyển đổi tinh tế ở đỉnh phải chữ U (biểu thị Convert & Nâng cấp) */}
      <path
        d="M60 41 L68 32 L76 41"
        stroke="#818cf8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Điểm nút bắt đầu tối giản ở đỉnh trái */}
      <circle cx="32" cy="28" r="3.5" fill="#818cf8" />
    </svg>
  );
};
