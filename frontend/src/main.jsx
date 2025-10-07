import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QuizProvider } from './context/QuizContext.jsx';
import { AuthProvider } from './context/AuthContext'; 
// console.log("App mounting...");
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
 <QuizProvider>
      
      <App />
    </QuizProvider>
    </AuthProvider>
   
  </StrictMode>,
)
