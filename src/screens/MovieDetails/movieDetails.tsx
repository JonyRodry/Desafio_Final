import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type StoreState } from "../../store/store";
import { Button } from "react-bootstrap";
import styles from "./movieDetails.module.css";

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const movie = useSelector((state: StoreState) =>
    state.movies.movies_list.find((m) => m.id === Number(id))
  );

  if (!movie) {
    return (
      <div
        className={styles.movieDetailsContainer}
        style={{ justifyContent: "center" }}
      >
        <h1>Filme não encontrado</h1>
      </div>
    );
  }

  return (
    <div className={styles.movieDetailsContainer}>
      <h1 style={{ marginBottom: "30px" }}>{movie.name}</h1>
      <img src={movie.banner} alt={movie.name} className={styles.imgBanner} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <p>
          <strong>Género:</strong> {movie.genre}
        </p>
        <p>
          <strong>Status:</strong> {movie.isWatched ? "Visto" : "Não visto"}
        </p>
      </div>
      <Button variant="secondary" onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </div>
  );
};
