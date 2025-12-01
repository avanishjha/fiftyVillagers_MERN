import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import BlogManager from './pages/admin/BlogManager';
import BlogEditor from './pages/admin/BlogEditor';
import GalleryManager from './pages/admin/GalleryManager';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import Gallery from './pages/public/Gallery';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
          <Route path="gallery" element={<GalleryManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
