import { ADD_MOVIE, EDIT_MOVIE, WATCHED_MOVIE, DELETE_MOVIE, SET_MOVIES, type MovieState, type MoviesTypeActions } from "./types";

export const moviesInitialState: MovieState = {
    movies_list: [],
};

export const moviesReducer = (state = moviesInitialState, action: MoviesTypeActions): MovieState => {
    switch (action.type) {
        case ADD_MOVIE:
            return {
                ...state,
                movies_list: [...state.movies_list, action.payload],
            };
        case DELETE_MOVIE:
            return {
                ...state,
                movies_list: state.movies_list.filter((movie) => movie.id !== action.payload),
            };
        case EDIT_MOVIE:
            return {
                ...state,
                movies_list: state.movies_list.map((user) =>
                    user.id === action.payload.id
                        ? { ...action.payload }
                        : user
                )
            }
        case WATCHED_MOVIE:
            return {
                ...state,
                movies_list: state.movies_list.map((movie) =>
                    movie.id === action.payload
                        ? { ...movie, isWatched: !movie.isWatched }
                        : movie
                )
            };
        case SET_MOVIES:
            return {
                ...state,
                movies_list: action.payload
            };
        default:
            return state;
    }
};
