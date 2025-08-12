import { Provider } from "react-redux";
import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { Homepage } from "./screens";
import { store, persistor } from "./store/store";
import "./App.css";
import { Menu } from "./screens/Menu";
import Box from "@mui/material/Box";
import { Movies } from "./screens/Movies";
import { PersistGate } from "redux-persist/integration/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MovieDetails } from "./screens/MovieDetails/movieDetails";

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Box display="flex" flexDirection="column" height="100vh">
            <Menu />
            <Box flex={1} p={2} className="content">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
