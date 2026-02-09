import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 16 / 9 }) {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 5,
    y: 5,
    width: 90,
    height: 90 / aspectRatio,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    // Center the crop
    const cropWidth = 90;
    const cropHeight = (cropWidth / aspectRatio) * (width / height);

    setCrop({
      unit: '%',
      width: cropWidth,
      height: Math.min(cropHeight, 90),
      x: (100 - cropWidth) / 2,
      y: (100 - Math.min(cropHeight, 90)) / 2,
      aspect: aspectRatio,
    });
  }, [aspectRatio]);

  const getCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        const croppedPreview = canvas.toDataURL('image/jpeg');
        onCropComplete(croppedFile, croppedPreview);
      }
    }, 'image/jpeg', 0.95);
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
          <p className="text-sm text-gray-500">Adjust the crop area for the best display on the home page</p>
        </div>

        <div className="p-4 overflow-auto max-h-[60vh] flex justify-center bg-gray-100">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              crossOrigin="anonymous"
              onLoad={onImageLoad}
              className="max-w-full max-h-[55vh]"
            />
          </ReactCrop>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Recommended: 16:9 aspect ratio for best display
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={getCroppedImage}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
