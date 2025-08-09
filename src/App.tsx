import { useEffect } from "react";
import "./App.css";
import CreateForm from "./components/createForm";
import { useDispatch } from "react-redux";
import { loadTemplatesFromStorage } from "./redux/formSlice";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import FormList from "./components/FormList";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTemplatesFromStorage());
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
    },
  });

  return (
    <>
      <Container maxWidth="lg">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FormList />
        </ThemeProvider>
      </Container>
    </>
  );
}

export default App;
