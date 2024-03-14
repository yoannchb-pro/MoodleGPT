/**
 * Convert an image html element into a base64 image string
 * @param imageElement
 * @param quality (default: 0.75 -> 75%)
 * @returns
 */
function imageToBase64(imageElement: HTMLImageElement, quality = 0.75): Promise<string | null> {
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

      const base64 = canvas.toDataURL('image/png', quality);
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
