import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../src/pages/Landing';
import Blog from '../src/pages/Blog';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import Banner from './components/Banner';
import Videojuegos from './pages/Videojuegos';
import DetalleVideojuego from './pages/DetalleVideojuego';


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/videojuegos" element={<Videojuegos />} />
        <Route path="/videojuego/:slug" element={<DetalleVideojuego />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
