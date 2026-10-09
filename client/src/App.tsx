import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/wrappers/ProtectedRoute"
import Layout from "./components/Layout"
import LoginPage from "./pages/login/page"
import WorkshopPage from "./pages/workshop/page"
import NotFoundPage from "./pages/not-found/page"

function App() {

  return (
    <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={
              <ProtectedRoute>
                <Layout/>
              </ProtectedRoute>} 
            >
              <Route path="/workshop" element={<WorkshopPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />}/>
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App
