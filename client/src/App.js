import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Layout from "./Components/Layout";
import SignInPage from "./pages/SignInPage";
import ChannelPage from "./pages/ChannelPage";
import UploadVideoPage from "./pages/UploadVideoPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CurrentVideoPage from "./pages/CurrentVideoPage";
import VideoEditPage from "./pages/VideoEditPage";
import SearchPage from "./pages/SearchPage";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/upload_video" element={<UploadVideoPage />} />
          <Route path="update_profile/:id" element={<UpdateProfilePage />} />
          <Route path="/video/:id" element={<CurrentVideoPage />} />
          <Route path="/video_edit/:id" element={<VideoEditPage />} />
          <Route path="/search/:query" element={<SearchPage />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sign_in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
