import React, { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type StoreState } from "../../store/store";
import {
  addMovieAction,
  editMovieAction,
  watchedMovieAction,
  deleteMovieAction,
  type Movie,
} from "../../store";
import { useAlert } from "../../hooks/userAlert";
import Alert from "../../components/Alerts/alerts";
import { MoviesCard } from "../../components/MoviesCards";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import styles from "./movies.module.css";

export const Movies: React.FC = () => {
  const movies = useSelector((state: StoreState) => state.movies.movies_list);
  const dispatch = useDispatch();
  const showAlert = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [userid, setUserid] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [searchByChar, setSearchByChar] = useState<string>("");
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [arrayByGenre, setArrayByGenre] = useState<Movie[]>(movies);

  const topGenres = [
    "Ação",
    "Animação",
    "Aventura",
    "Comédia",
    "Documentário",
    "Drama",
    "Ficção Científica",
    "Romance",
    "Suspense",
    "Terror",
  ];

  useEffect(() => {
    const storedMovies = localStorage.getItem("moviesLocalStorage");
    if (storedMovies) {
      dispatch({ type: "SET_MOVIES", payload: JSON.parse(storedMovies) });
    }
  }, [dispatch]);

  // Salva no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem("moviesLocalStorage", JSON.stringify(movies));
    setArrayByGenre(movies);
  }, [movies]);

  const filtredMovies = (genre: string, search: string) => {
    let result = movies;

    if (genre) {
      result = result.filter((m) => m.genre === genre);
    }

    if (search) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setArrayByGenre(result);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleChangeBoolean = (id: number) => {
    dispatch(watchedMovieAction(id));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedOrRaw = await compressOrReadImage(file);
      setPreviewUrl(compressedOrRaw);
    } catch (err) {
      console.error("Erro no processamento da imagem:", err);
      setPreviewUrl(null);
    }
  };

  const restart = () => {
    setName("");
    setGenre("");
    setIsChecked(false);
    setUserid(0);
    setIsEditing(false);
    setShowModal(false);
  };

  const handleAddUser = (
    name: string,
    imgFile: string,
    genre: string,
    marcado: boolean
  ) => {
    if (name.trim() && genre.trim() && imgFile) {
      dispatch(addMovieAction(name, imgFile, genre, marcado));
      showAlert("success", "User adicionado com sucesso!");
      restart();
    } else {
      showAlert("error", "Todos os campos têm de estar preenchidos");
    }
  };

  const handleEditUser = (
    id: number,
    name: string,
    imgFile: string,
    genre: string,
    watch: boolean
  ) => {
    if (name.trim() && genre.trim()) {
      console.log(watch);
      dispatch(
        editMovieAction({ id, name, banner: imgFile, genre, isWatched: watch })
      );
      showAlert("success", "User editado com sucesso!");
      restart();
    } else {
      showAlert("error", "Todos os campos têm de estar preenchidos");
    }
  };

  const toEditUser = (movie: Movie) => {
    setUserid(movie.id);
    setName(movie.name);
    setGenre(movie.genre);
    setPreviewUrl(movie.banner);
    setIsChecked(movie.isWatched);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteUser = (id: number) => {
    dispatch(deleteMovieAction(id));
    showAlert("success", "Utilizador removido com sucesso.");
  };

  const compressOrReadImage = (
    file: File,
    maxWidth = 1200,
    maxHeight = 900,
    quality = 1
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const isSVG = file.type === "image/svg+xml";

      if (isSVG) {
        // Só lê o arquivo como texto, sem compressão
        const reader = new FileReader();
        reader.onload = () => {
          if (!reader.result) return reject("Failed to read SVG");
          resolve(reader.result as string); // SVG é texto (XML)
        };
        reader.onerror = () => reject("Error reading SVG");
        reader.readAsText(file);
      } else if (file.type.startsWith("image/")) {
        // Compressão para imagens raster (jpeg, png, jpg, etc)
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          if (!e.target) return reject("No file loaded");
          img.src = e.target.result as string;
        };

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height *= maxWidth / width));
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width *= maxHeight / height));
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Failed to get canvas context");

          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Canvas is empty");
              const compressedReader = new FileReader();
              compressedReader.onloadend = () => {
                resolve(compressedReader.result as string);
              };
              compressedReader.readAsDataURL(blob);
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject("Image load error");
        reader.readAsDataURL(file);
      } else {
        reject("Unsupported file type");
      }
    });
  };

  return (
    <div className={styles.moviesContainer}>
      <h1 style={{ margin: "0", marginBottom: "40px" }}>Gestor de Filmes</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          height: "60px",
          alignItems: "center",
          position: "absolute",
          paddingRight: "10%",
        }}
      >
        <Button
          className={styles.BtnPosition}
          onClick={() => setShowModal(true)}
          variant="contained"
          color="success"
          sx={{
            width: "8%",
            height: "75%",
            borderRadius: "20px",
            fontSize: "clamp(0.6vw, 0.8vw, 1vw)",
          }}
        >
          Add Movie
        </Button>
      </div>
      <div className={styles.rowFilters}>
        <div style={{ width: "40%", height: "100%" }}>
          <TextField
            label="Pesquisar por nome..."
            variant="outlined"
            fullWidth
            value={searchByChar}
            onChange={(e) => {
              const value = e.target.value;
              setSearchByChar(value);
              filtredMovies(filterGenre, value);
            }}
          />
        </div>
        <div style={{ width: "30%", height: "100%" }}>
          <FormControl
            fullWidth
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <InputLabel
              id="filter-genre-label"
              sx={{ zIndex: "2", backgroundColor: "rgb(216, 217, 212)" }}
            >
              Filtrar por género
            </InputLabel>
            <Select
              labelId="filter-genre-label"
              value={filterGenre}
              onChange={(e) => {
                const value = e.target.value;
                setFilterGenre(value);
                filtredMovies(value, searchByChar);
              }}
              sx={{ width: "100%" }}
            >
              <MenuItem value="">
                <em>Todos os géneros</em>
              </MenuItem>
              {topGenres.map((g, index) => (
                <MenuItem key={index} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div
          style={{
            width: "20%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setSearchByChar("");
              setFilterGenre("");
              setArrayByGenre(movies);
            }}
            disabled={!setSearchByChar && !filterGenre}
            sx={{
              width: "100%",
              height: "75%",
              borderRadius: "20px",
              fontSize: "clamp(0.6vw, 0.8vw, 1vw)",
            }}
          >
            Limpar
          </Button>
        </div>
      </div>
      <div className={styles.userGrid}>
        {arrayByGenre.length > 0 ? (
          arrayByGenre.map((movie) => (
            <MoviesCard
              selectedMovie={movie}
              btnEditMovie={toEditUser}
              btnDeleteMovie={handleDeleteUser}
              changeWatched={handleChangeBoolean}
            ></MoviesCard>
          ))
        ) : (
          <div className={styles.textNoUsers}>
            Nenhum utilizador encontrado.
          </div>
        )}
      </div>
      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          restart();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Editar Filme" : "Adicionar Filme"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Filme"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" component="label">
            Upload Capa
            <input hidden type="file" onChange={handleImageChange} />
          </Button>
          <FormControl fullWidth margin="normal">
            <InputLabel id="genre-label">Género</InputLabel>
            <Select
              labelId="genre-label"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <MenuItem value="">
                <em>Selecione um género</em>
              </MenuItem>
              {topGenres.map((g, index) => (
                <MenuItem key={index} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox checked={isChecked} onChange={handleChange} />}
            label="Já viste este filme?"
          />

          <Typography className="mt-2">
            Este filme está marcado como: {isChecked ? "VISTO" : "NÃO VISTO"}.
          </Typography>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (previewUrl) {
                  handleEditUser(userid, name, previewUrl, genre, isChecked);
                } else {
                  showAlert("error", "Por favor, selecione uma imagem.");
                }
              }}
            >
              Save changes
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (previewUrl) {
                  handleAddUser(name, previewUrl, genre, isChecked);
                } else {
                  showAlert("error", "Por favor, selecione uma imagem.");
                }
              }}
            >
              Save new task
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Alert />
    </div>
  );
};
