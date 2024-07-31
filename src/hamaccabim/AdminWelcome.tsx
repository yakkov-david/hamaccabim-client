import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminWelcome.css';

const AdminWelcome: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="admin-welcome">
            <h1>Welcome, Manager</h1>
            <div className="button-container">
                <button onClick={() => handleNavigation('/AnalyticsPage')} className="nav-button">Analytics Page</button>
                <button onClick={() => handleNavigation('/ManagerForm')} className="nav-button">Manager Form</button>
                <button onClick={() => handleNavigation('/DataTable')} className="nav-button">Managers table</button>
            </div>
        </div>
    );
};

export default AdminWelcome;
