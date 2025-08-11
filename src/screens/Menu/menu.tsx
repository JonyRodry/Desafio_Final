import styles from './menus.module.css'
import { NavLink } from 'react-router';

export const Menu: React.FC = () => {
	return (
		<div className={styles.menuContainer}>
			<NavLink to="/" className={styles.menuLinks}>Homepage</NavLink>
			<NavLink to="/movies" className={styles.menuLinks}>Movies</NavLink>
		</div>
	);
};