import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import SubmitMusic from './pages/SubmitMusic';
import DMCA from './pages/DMCA';
import Terms from './pages/Terms';
import ArticleDetail from './pages/ArticleDetail';
import Overalls from './pages/Overalls';
import OverallDetail from './pages/OverallDetail';
import AdminLogin from './pages/admin/AdminLogin';
import OverallsList from './pages/admin/OverallsList';
import OverallCreate from './pages/admin/OverallCreate';
import OverallEdit from './pages/admin/OverallEdit';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/submit-music" element={<SubmitMusic />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/overalls" element={<Overalls />} />
          <Route path="/overalls/:slug" element={<OverallDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/overalls" element={<OverallsList />} />
          <Route path="/admin/overalls/create" element={<OverallCreate />} />
          <Route path="/admin/overalls/edit/:id" element={<OverallEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
