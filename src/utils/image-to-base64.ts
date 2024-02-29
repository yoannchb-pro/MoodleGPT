/**
 * Convert an image html element into a base64 image string
 * @param imageElement
 * @returns
 */
function imageToBase64(imageElement: HTMLImageElement): Promise<string | null> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(null);
      canvas.remove();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const base64 = canvas.toDataURL('image/png');
      resolve(base64);

      canvas.remove();
    };

    img.onerror = () => {
      resolve(null);
      canvas.remove();
    };

    img.src = imageElement.src;
  });
}

export default imageToBase64;
