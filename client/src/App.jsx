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
import ApplicationManager from './pages/admin/ApplicationManager';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import Gallery from './pages/public/Gallery';
import ApplicationForm from './pages/student/ApplicationForm';
import StudentLogin from './pages/student/StudentLogin';
import StudentRegister from './pages/student/StudentRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import AdmitCard from './pages/student/AdmitCard';
import ApplicationInstructions from './pages/student/ApplicationInstructions';
import StudentLayout from './layouts/StudentLayout';
import SuccessStories from './pages/public/SuccessStories';
import SuccessStoriesManager from './pages/admin/SuccessStoriesManager';

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
          <Route path="success-stories" element={<SuccessStories />} />
          <Route path="instructions" element={<ApplicationInstructions />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route path="apply" element={<ApplicationForm />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="admit-card" element={<AdmitCard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="success-stories" element={<SuccessStoriesManager />} />
          <Route path="applications" element={<ApplicationManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
