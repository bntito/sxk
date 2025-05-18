import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/menu/Menu';
import routes from './routes/Index';

const Emep = () => {
    return (
        <Router>
            <div className="app-container">
                {/* <div className="menu-container">
                    <Menu />
                </div> */}
                <div className="main-content">
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default Emep;
