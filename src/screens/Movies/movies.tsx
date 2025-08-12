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
import styles from "./movies.module.css";
import { Container, Table, Form, Modal, Button, Col } from "react-bootstrap";
import Alert from "../Alerts/alerts";
import { useAlert } from "../../hooks/userAlert";
import { MoviesCard } from "../MoviesCards/moviesCards";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";

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
  // Pesquisa e filtro por género
  const [searchByChar, setSearchByChar] = useState<string>("");
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [arrayByGenre, setArrayByGenre] = useState<Movie[]>(movies);

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
      <h1 style={{ margin: "0", marginBottom: "20px" }}>Gestor de Filmes</h1>
      <div className={styles.rowFilters}>
        <div style={{ width: "50%" }}>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchByChar}
            onChange={(e) => {
              const value = e.target.value;
              setSearchByChar(value);
              filtredMovies(filterGenre, value);
            }}
          />
        </div>
        <div style={{ width: "30%" }}>
          <Form.Select
            value={filterGenre}
            onChange={(e) => {
              const value = e.target.value;
              setFilterGenre(value);
              filtredMovies(value, searchByChar);
            }}
          >
            <option value="">Todos os géneros</option>
            {topGenres.map((g, index) => (
              <option key={index} value={g}>
                {g}
              </option>
            ))}
          </Form.Select>
        </div>

        <div style={{ width: "10%" }}>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchByChar("");
              setFilterGenre("");
              setArrayByGenre(movies);
            }}
            disabled={!setSearchByChar && !filterGenre}
          >
            Limpar
          </Button>
        </div>
        <div
          style={{ width: "10%", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={styles.BtnPosition}
            onClick={() => setShowModal(true)}
            variant="success"
          >
            Add User
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
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          restart();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nome do filme</Form.Label>
              <Form.Control
                placeholder=""
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Capa do filme</Form.Label>
              <Form.Control
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="formGenre" className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">Selecione um género</option>
                {topGenres.map((g, index) => (
                  <option key={index} value={g}>
                    {g}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="checkbox"
              id="custom-checkbox"
              label="Já viste este filme?"
              checked={isChecked}
              onChange={handleChange}
            />

            <p className="mt-2">
              Este filme está marcado como: {isChecked ? "VISTO" : "NÃO VISTO"}.
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <Button
              variant="success"
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
              variant="success"
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
        </Modal.Footer>
      </Modal>
      <Alert />
    </div>
  );
};
