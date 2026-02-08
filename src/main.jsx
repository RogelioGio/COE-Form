import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fontsource/google-sans/400.css';
import '@fontsource/google-sans/500.css';
import '@fontsource/google-sans/600.css';
import '@fontsource/google-sans/700.css';
import { Toaster } from "@/components/ui/sonner"
import Layout from './Layout';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout />
    <Toaster />
  </StrictMode>,
)
