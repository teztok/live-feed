import { useEffect, useState } from 'react';

const defaultState = { src: undefined, status: 'loading' };

export default function useImage(url) {
  const [image, setImage] = useState(defaultState);

  useEffect(() => {
    if (!url) return;
    const img = document.createElement('img');
    const onLoad = () => setImage({ src: img.src, status: 'success' });
    const onError = () => setImage({ src: undefined, status: 'failed' });

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = url;

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      setImage(defaultState);
    };
  }, [url]);

  return {
    ...image,
  };
}
