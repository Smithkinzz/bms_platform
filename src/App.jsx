import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/sidebar/sidebar";
import Home from "./components/Page/Home";      
import Alert from "./components/Page/Alert";
import Report from "./components/Page/Report"; 
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div>
          <Sidebar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />    
          <Route path="/report" element={<Report />} />  
          <Route path="/alert" element={<Alert />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
