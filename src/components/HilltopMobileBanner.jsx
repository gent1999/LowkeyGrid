import { useEffect, useRef } from 'react';

/**
 * Hilltop Ads Mobile Banner for 2koveralls
 * Mobile only - shown below back button, above title
 */
const HilltopMobileBanner = ({ className = '' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && adRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pricklyassociation.com/bIXUVms.dLG-le0gYKWgcH/oegm/9ju_ZmUalVkPPITWYT4/Mgz/I/3iOPTWMPtCN/j/g/zAM/jfcS5BNSwO';
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';

      script.onload = () => console.log('Hilltop mobile banner loaded');
      script.onerror = () => console.error('Failed to load Hilltop mobile banner');

      adRef.current.appendChild(script);

      return () => {
        if (adRef.current && adRef.current.contains(script)) {
          adRef.current.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className={`lg:hidden mb-6 ${className}`}>
      <div className="text-xs text-gray-400 mb-2 text-center">Advertisement</div>
      <div
        ref={adRef}
        className="w-full min-h-[100px]"
      >
        {/* Hilltop mobile ad will load here */}
      </div>
    </div>
  );
};

export default HilltopMobileBanner;
