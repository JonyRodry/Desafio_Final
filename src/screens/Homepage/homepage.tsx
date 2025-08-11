import { useNavigate } from "react-router-dom";
import styles from './homepage.module.css'

export const Homepage: React.FC = () => {

	const navigate = useNavigate();

	const handleCTA = () => {
		navigate("/movies");
	};
	return (
		<div className={styles.homepageContainer}>

			<div className={styles.overlay} />

			<video className={styles.videoBG} autoPlay muted loop playsInline>
				<source src="/videos/video.mp4" type="video/mp4" />
			</video>

			<div className={styles.infoHomepage} >
				<h1 style={{margin: "0", marginBottom: "20px"}}>BEM-VINDO AO NOSSO GESTOR DE FILMES</h1>
				<h3 style={{margin: "0", marginBottom: "20px"}}>Veja os filmes disponiveis e adicione ou edite um!</h3>
				<button onClick={handleCTA} className={styles.btnCTA}>
					Saiba mais
				</button>
			</div>

		</div>
	);
};