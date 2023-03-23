import ReactDOM from 'react-dom/client';
import '@/utils/env';
import '@/utils/fetch/crypto';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AliveScope } from 'react-activation';
import { store } from '@/redux/store';
import App from '@/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AliveScope>
        <App />
      </AliveScope>
    </BrowserRouter>
  </Provider>
);
