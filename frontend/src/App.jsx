import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { CreateEverestPage } from "./pages/CreateEverest/CreateEverestPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import TestUpload from "./pages/TestUpload";
import { EverestPage } from "./pages/Everest/EverestPage";
import { AboutPage } from "./pages/About/AboutPage";


// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/posts",
    element: <FeedPage />,
  },
  {
    path: "/createeverest",
    element: <CreateEverestPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/test-upload",      
    element: <TestUpload />,
  },
  {
    path: "/everests/:id",
    element: <EverestPage/>
  },

  {
    path: "/about",
    element: <AboutPage />
  },

]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
