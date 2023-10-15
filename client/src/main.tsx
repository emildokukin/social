import ReactDOM from 'react-dom/client'
import App from './components/App.tsx'
import './index.scss'
import {Provider} from 'react-redux'
import {store} from './store/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>
)
