import React, { useState } from 'react';
import config from '../config';

interface Manager {
    id?: number;
    email: string;
    password: string;
    role?: 'manager' | 'super-admin'; // Define roles in the Manager interface
    action: 'register';
}

interface ManagerFormProps { }

const ManagerForm: React.FC<ManagerFormProps> = () => {
    const [action, setAction] = useState<'create' | 'update' | 'delete'>('create');
    const [manager, setManager] = useState<Manager>({ email: '', password: '', action: 'register' });
    const [managerId, setManagerId] = useState<number | undefined>(undefined);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setManager(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAction(e.target.value as 'create' | 'update' | 'delete');
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = `${config.apiUrl}/users` + (action !== 'create' ? `/${managerId}` : '');
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE';
        const body = action !== 'delete' ? JSON.stringify(manager) : undefined;
        const headers = { 'Content-Type': 'application/json' };

        const response = await fetch(url, { method, headers, body });
        const data = await response.json();
        console.log(data);
    };

    return (
        <div>
            <select value={action} onChange={handleSelectChange}>
                <option value="create">Create Manager</option>
                <option value="update">Update</option> 
                <option value="delete">Delete Manager</option>
            </select>
            {action !== 'delete' && (
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={manager.email} onChange={handleInputChange} required />
                    <input type="password" name="password" placeholder="Password" value={manager.password} onChange={handleInputChange} required />
                    {action === 'create' || action === 'update' ? (
                        <>
                            <select name="role" value={manager.role || ''} onChange={handleInputChange} required>
                                <option value="manager">Manager</option>
                                <option value="super-admin">Super Admin</option>
                            </select>
                            {action === 'update' && (
                                <input type="number" name="id" placeholder="Manager ID" value={managerId} onChange={(e) => setManagerId(parseInt(e.target.value))} required />
                            )}
                        </>
                    ) : null}
                    <button type="submit">{action.charAt(0).toUpperCase() + action.slice(1)}</button>
                </form>
            )}
            {action === 'delete' && (
                <form onSubmit={handleSubmit}>
                    <input type="number" name="id" placeholder="Manager ID" value={managerId} onChange={(e) => setManagerId(parseInt(e.target.value))} required />
                    <button type="submit">Delete</button>
                </form>
            )}
        </div>
    );
};

export default ManagerForm;
