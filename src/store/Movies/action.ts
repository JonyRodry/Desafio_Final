import { type Movie, ADD_MOVIE, EDIT_MOVIE, WATCHED_MOVIE, DELETE_MOVIE, SET_MOVIES} from "./types";

export const addMovieAction = (name: string, banner: string, genre: string, isWatched: boolean) => {
    const newMovie: Movie = {
        id: Date.now(),
        name,
        banner,
        genre,
        isWatched,
    };
    return{
        type: ADD_MOVIE,
        payload: newMovie,
    };
};

export const editMovieAction = (movie: Movie) => ({
    type: EDIT_MOVIE,
    payload: movie,
});

export const watchedMovieAction = (id: number) => ({
    type: WATCHED_MOVIE,
    payload: id,
});

export const deleteMovieAction = (id: number) => ({
    type: DELETE_MOVIE,
    payload: id,
});

export const setMoviesAction = (movies: Movie[]) => ({
  type: SET_MOVIES,
  payload: movies
});