import { Dashboard } from "./pages/dashboard";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Youtube } from "./pages/youtube";
import { Twitter } from "./pages/twitter";
import { BrainViewer } from "./pages/BrainViewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/brain/:hash" element={<BrainViewer />} />
        <Route path="/twitter" element={<Twitter />} />
        <Route path="/youtube" element={<Youtube />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
