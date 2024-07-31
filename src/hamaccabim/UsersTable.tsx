import * as React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Fab, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import config from '../config';
import './UsersTable.css';

// Define an interface that matches the structure of your data
interface User {
    _id: { $oid: string } | string;
    email: string;
    name: string;
    role: string;
    password?: string;
    action: string;
}

const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'action', headerName: 'Action', width: 130 },
];

export default function UsersTable() {
    const [rows, setRows] = React.useState<User[]>([]);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [formData, setFormData] = React.useState({
        email: '',
        name: '',
        password: '',
        role: 'admin',
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);

    React.useEffect(() => {
        fetch(config.apiUrl + `/users`)
            .then((response) => response.json())
            .then((data: User[]) => setRows(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleClickOpen = () => {
        setEditMode(false);
        setFormData({
            email: '',
            name: '',
            password: '',
            role: 'admin',
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const requestData = {
            ...formData,
            action: editMode ? 'update' : 'register', // Ensure the correct action is sent
        };

        const url = editMode ? `${config.apiUrl}/users/${selectedId}` : `${config.apiUrl}/users`;
        const method = editMode ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data: User) => {
                if (editMode) {
                    setRows((prevRows) => prevRows.map((row) => {
                        const id = typeof row._id === 'object' ? row._id.$oid : row._id;
                        return id === selectedId ? data : row;
                    }));
                } else {
                    setRows((prevRows) => [...prevRows, data]);
                }
                handleClose();
            })
            .catch((error) => console.error(`Error ${editMode ? 'updating' : 'registering'} user:`, error));
    };

    const handleRowDoubleClick = (params: GridRowParams) => {
        setSelectedId(params.id as string);
        const rowData = rows.find((row) => {
            const id = typeof row._id === 'object' ? row._id.$oid : row._id;
            return id === params.id;
        });

        if (rowData) {
            fetch(`${config.apiUrl}/users/${params.id}`)
                .then((response) => response.json())
                .then((data: User) => {
                    setFormData({
                        email: data.email,
                        name: data.name,
                        password: '', // Do not prefill the password field with the hashed password
                        role: data.role,
                    });
                })
                .catch((error) => console.error('Error fetching user details:', error));

            setEditMode(true);
            setOpen(true);
        }
    };

    const handleSelectionModelChange = (selectionModel: GridRowSelectionModel) => {
        const selectedIds = selectionModel.map((id) => id as string);
        setSelectedIds(selectedIds);
        setSelectedId(selectedIds.length === 1 ? selectedIds[0] : null);
    };

    const handleDelete = () => {
        if (selectedIds.length > 0) {
            const deleteRequests = selectedIds.map((id) =>
                fetch(`${config.apiUrl}/users/${id}`, {
                    method: 'DELETE',
                })
            );

            Promise.all(deleteRequests)
                .then(() => {
                    setRows((prevRows) => prevRows.filter((row) => {
                        const id = typeof row._id === 'object' ? row._id.$oid : row._id;
                        return !selectedIds.includes(id);
                    }));
                    setSelectedIds([]);
                    setSelectedId(null);
                })
                .catch((error) => console.error('Error deleting users:', error));
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleResetPasswordOpen = () => {
        setResetPasswordOpen(true);
    };

    const handleResetPasswordClose = () => {
        setResetPasswordOpen(false);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleResetPasswordSubmit = () => {
        fetch(`${config.apiUrl}/users/${selectedId}`)
            .then((response) => response.json())
            .then((data: User) => {
                const requestData = {
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    password: newPassword,
                    action: 'register', // This ensures the password hashing logic is applied on the server
                };

                fetch(`${config.apiUrl}/users/${selectedId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                })
                    .then((response) => response.json())
                    .then((updatedData: User) => {
                        setRows((prevRows) => prevRows.map((row) => {
                            const id = typeof row._id === 'object' ? row._id.$oid : row._id;
                            return id === selectedId ? updatedData : row;
                        }));
                        handleResetPasswordClose();
                        alert('Password reset successfully.');
                    })
                    .catch((error) => console.error('Error resetting password:', error));
            })
            .catch((error) => console.error('Error fetching user details:', error));
    };

    return (
        <div className="dataTableContainer">
            <div className="dataGridWrapper">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => {
                        const id = row._id;
                        return typeof id === 'object' ? id.$oid : id;
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowDoubleClick={handleRowDoubleClick}
                    onRowSelectionModelChange={handleSelectionModelChange}
                />
            </div>
            <div className="fabWrapper">
                <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
                    <AddIcon />
                </Fab>
                {selectedIds.length > 0 && (
                    <Button variant="contained" color="secondary" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
                        Delete Selected
                    </Button>
                )}
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit Administrator' : 'Register New Administrator'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {!editMode && (
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                    {editMode && (
                        <Button variant="contained" color="primary" onClick={handleResetPasswordOpen}>
                            Reset Password
                        </Button>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? 'Update' : 'Register'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={resetPasswordOpen} onClose={handleResetPasswordClose}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="newPassword"
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle new password visibility"
                                        onClick={handleClickShowNewPassword}
                                        edge="end"
                                    >
                                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleResetPasswordClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleResetPasswordSubmit} color="primary">
                        Reset Password
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
