import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { type StoreState } from "../../store";
import { Menu, MenuItem } from "@mui/material";
import styles from "./moviesDropdown.module.css";

export const MoviesDropdown: React.FC = () => {
  const movies = useSelector((state: StoreState) => state.movies.movies_list);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        aria-controls={anchorEl ? "movies-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        className={styles.menuLinks}
      >
        Movies
      </button>

      <Menu
        id="movies-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{marginTop: "30px", marginLeft: "5px"}}
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MenuItem
              key={movie.id}
              component={Link}
              to={`/movie/${movie.id}`}
              onClick={handleClose}
              
            >
              {movie.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum filme disponível</MenuItem>
        )}
      </Menu>
    </>
  );
};
