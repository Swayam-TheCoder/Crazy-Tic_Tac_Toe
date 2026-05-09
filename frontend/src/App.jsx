import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import OneVsOne from "./pages/OneVsOne";
import OneVsBot from "./pages/OneVsBot";
import Online from "./pages/Online";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/1v1"
          element={<OneVsOne />}
        />

        <Route
          path="/1vbot"
          element={<OneVsBot />}
        />

        <Route
          path="/online"
          element={<Online />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;