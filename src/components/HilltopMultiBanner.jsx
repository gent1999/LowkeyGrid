import { useEffect, useRef } from 'react';

/**
 * Hilltop Ads Multi-Tag Banner Component for 2koveralls
 * Desktop sidebar - 300x250
 */
const HilltopMultiBanner = ({ className = '' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && adRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pricklyassociation.com/b/X/V.sxdQGulR0LYbWYck/lehm/9TurZ/USlrkhPWT/Yq4dMvzcIj3ZNVjwEDt/NcjAgIzYMNjfcU2/NaQE';
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';

      script.onload = () => console.log('Hilltop desktop ad script loaded');
      script.onerror = () => console.error('Failed to load Hilltop desktop ad script');

      adRef.current.appendChild(script);

      return () => {
        if (adRef.current && adRef.current.contains(script)) {
          adRef.current.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className={`hilltop-multi-banner ${className}`}>
      <div className="text-xs text-gray-400 mb-2 text-center">Advertisement</div>
      <div
        ref={adRef}
        className="min-h-[250px] w-full max-w-[300px] mx-auto"
      >
        {/* Hilltop ad will load here */}
      </div>
    </div>
  );
};

export default HilltopMultiBanner;
