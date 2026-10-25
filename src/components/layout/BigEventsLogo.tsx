'use client';

import React from 'react';

export function BigEventsLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect width="40" height="40" rx="10" fill="#FF5A1F" />
      <path
        d="M9 15C9 13.8954 9.89543 13 11 13H29C30.1046 13 31 13.8954 31 15V17.5C29.6193 17.5 28.5 18.6193 28.5 20C28.5 21.3807 29.6193 22.5 31 22.5V25C31 26.1046 30.1046 27 29 27H11C9.89543 27 9 26.1046 9 25V22.5C10.3807 22.5 11.5 21.3807 11.5 20C11.5 18.6193 10.3807 17.5 9 17.5V15Z"
        fill="#FFFFFF"
      />
      <line
        x1="16.5"
        y1="15.5"
        x2="16.5"
        y2="24.5"
        stroke="#FF5A1F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 2.5"
      />
    </svg>
  );
}
