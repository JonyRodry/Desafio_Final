import React from "react";
import { MoviesDropdown } from '../MoviesDropdown';
import { NavLink } from 'react-router';
import styles from './menus.module.css'

export const Menu: React.FC = () => {
	return (
		<div className={styles.menuContainer}>
			<NavLink to="/" className={styles.menuLinks}>Homepage</NavLink>
			<NavLink to="/allMovies" className={styles.menuLinks}>All Movies</NavLink>
			<MoviesDropdown/>
		</div>
	);
};