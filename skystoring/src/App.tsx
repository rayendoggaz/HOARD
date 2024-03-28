// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/signup/Signup';
import SignIn from './components/signin/signin';
import WelcomePage from './components/home/WelcomePage';
import MainPage from './components/mainpage/mainpage';
import Hoard from './components/mainpage/hoard/hoard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hoard" element={<Hoard/>} />
        <Route path="/mainpage" element={<MainPage />}/>
      </Routes>
    </Router>
  );
};

export default App;
