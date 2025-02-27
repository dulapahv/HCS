import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import EmojiPasswordApp from './pages/EmojiPasswordApp';
import TextPasswordApp from './pages/TextPasswordApp';
import ShoulderSurfingExperiment from './pages/ShoulderSurfingExperiment';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/emoji-password' element={<EmojiPasswordApp />} />
        <Route path='/text-password' element={<TextPasswordApp />} />
        <Route
          path='/shoulder-surfing'
          element={<ShoulderSurfingExperiment />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
