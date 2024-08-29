import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    // React strict mode commented out to enable react-beautiful-dnd fully working!!!
    //<React.StrictMode>
    <App/>
    //</React.StrictMode>
)
