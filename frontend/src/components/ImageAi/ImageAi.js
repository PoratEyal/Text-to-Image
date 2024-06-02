import { useState, useEffect } from 'react';
import styles from './ImageAi.module.css';

const ImageAi = ({ image }) => {
    const [downloadUrl, setDownloadUrl] = useState('');

    useEffect(() => {
        if (image) {
            const blob = new Blob([image], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [image]);

    return (
        <div className={styles.container}>
            <img className={styles.img} src={image} alt="Generated img" />
            <a href={downloadUrl} download="generated_image.png" className={styles.downloadBtn}>
                Download
            </a>
        </div>
    );
}

export default ImageAi;
