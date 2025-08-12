import React from "react";
import { Link } from "react-router-dom";
import { type Movie } from "../../store";
import {Card, CardActions, CardContent, CardMedia, Button, Typography, FormGroup, FormControlLabel, Checkbox} from "@mui/material";

interface MoviesCardProps {
  selectedMovie: Movie;
  btnEditMovie: (movie: Movie) => void;
  btnDeleteMovie: (id: number) => void;
  changeWatched: (id: number) => void;
}

export const MoviesCard: React.FC<MoviesCardProps> = ({
  selectedMovie,
  btnEditMovie,
  btnDeleteMovie,
  changeWatched,
}) => {
  return (
    <Card sx={{ width: "100%" }}>
      <Link to={`/movie/${selectedMovie.id}`}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="250"
          image={selectedMovie.banner}
        />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <strong>{selectedMovie.name}</strong>
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
          <strong>Genre</strong>: {selectedMovie.genre}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedMovie.isWatched}
                onChange={() => changeWatched(selectedMovie.id)}
              />
            }
            label="Visto"
          />
        </FormGroup>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => btnEditMovie(selectedMovie)}>
          Edit
        </Button>
        <Button size="small" onClick={() => btnDeleteMovie(selectedMovie.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
