import React from 'react';
import ReactDOM from 'react-dom/client';

// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import '../styles/TodoList.css';

// Componentes
import TodoList from './components/TodoList';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>
);