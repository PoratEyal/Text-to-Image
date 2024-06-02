import styles from './ImageAi.module.css';

const ImageAi = ({ image }) => {
    return (
        <div className={styles.container}>
            <img className={styles.img} src={image} alt="Generated img" />
            <a href={image} download="generated_image.png" className={styles.downloadBtn}>
                הורדה
            </a>
        </div>
    );
}

export default ImageAi;
