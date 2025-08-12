import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./homepage.module.css";

export const Homepage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.overlay} />

      <video className={styles.videoBG} autoPlay muted loop playsInline>
        <source src="/videos/video.mp4" type="video/mp4" />
      </video>

      <div className={styles.infoHomepage}>
        <Typography variant="h2" gutterBottom>
          BEM-VINDO AO NOSSO GESTOR DE FILMES
        </Typography>
        <Typography variant="h5" gutterBottom>
          Veja os filmes disponíveis e adicione ou edite um!
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/allMovies")}
          className={styles.btnCTA}
        >
          Saiba mais
        </Button>
      </div>
    </div>
  );
};
