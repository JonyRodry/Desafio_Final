export const ADD_MOVIE = "ADD_MOVIE";
export const EDIT_MOVIE = "EDIT_MOVIE";
export const WATCHED_MOVIE = "WATCHED_MOVIE";
export const DELETE_MOVIE = "DELETE_MOVIE";
export const SET_MOVIES = "SET_MOVIES";

export type MoviesTypeActions = AddMoviesType | EditMoviesType | WatchedMovieType | DeleteMovieType | SetMoviesType;

export interface MovieState{
    movies_list: Movie[];
}

export interface Movie{
    id: number;
    name: string;
    banner: string;
    genre: string;
    isWatched: boolean;
}

interface AddMoviesType{
    type: typeof ADD_MOVIE;
    payload: Movie;
}

interface EditMoviesType{
    type: typeof EDIT_MOVIE;
    payload: Movie;
}

interface WatchedMovieType{
    type: typeof WATCHED_MOVIE;
    payload: number;
}

interface DeleteMovieType{
    type: typeof DELETE_MOVIE;
    payload: number;
}


 interface SetMoviesType {
  type: typeof SET_MOVIES;
  payload: Movie[];
}



