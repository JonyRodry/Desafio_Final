import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Menu } from "./components/Menu";
import { Homepage, Movies, MovieDetails} from "./screens";
import Box from "@mui/material/Box";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";


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
                <Route path="/allMovies" element={<Movies />} />
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