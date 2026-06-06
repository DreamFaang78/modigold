import { ImageResponse } from 'next/og';

export const size        = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A2340',
          borderRadius: 0,
        }}
      >
        {/* Gold "M" letter mark */}
        <div
          style={{
            color: '#C9A84C',
            fontSize: 22,
            fontWeight: 900,
            fontFamily: 'Georgia, serif',
            letterSpacing: '-1px',
            lineHeight: 1,
          }}
        >
          M
        </div>
        {/* Gold bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#C9A84C',
          }}
        />
      </div>
    ),
    size,
  );
}
