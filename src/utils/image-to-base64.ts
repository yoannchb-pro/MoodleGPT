/**
 * Convert an image html element into a base64 image string
 * @param imageElement
 * @param quality (default: 0.75 -> 75%)
 * @returns
 */
function imageToBase64(imageElement: HTMLImageElement, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject("Can't get the canvas context, ensure your navigator support canvas");
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

    img.onerror = err => {
      reject(err);
      canvas.remove();
    };

    img.src = imageElement.src;
  });
}

export default imageToBase64;
