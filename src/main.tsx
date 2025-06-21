import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { ToastContainer } from 'react-toastify';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ToastContainer autoClose={4000} />
    <App />
  </Provider>
);
