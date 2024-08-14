/*import * as React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';
import './LandingPagesTable.css';

// Define an interface that matches the structure of your data
interface LandingPages {
    _id: { $oid: string } | string;
    CountdownDate: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    ImageUrl?: string;
    name?: string;
    twitterLink?: string;
}


const columns: GridColDef[] = [
    { field: 'CountdownDate', headerName: 'CountdownDate', width: 200 },
    { field: 'title', headerName: 'Title', width: 200 },
    {
        field: 'paragraph1',
        headerName: 'Paragraph1',
        width: 200,
        renderCell: (params) => (
            <div dangerouslySetInnerHTML={{ __html: params.value ? params.value.replace(/\n/g, '<br>') : '' }} />
        ),
    },
    {
        field: 'paragraph2',
        headerName: 'Paragraph2',
        width: 200,
        renderCell: (params) => (
            <div dangerouslySetInnerHTML={{ __html: params.value ? params.value.replace(/\n/g, '<br>') : '' }} />
        ),
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
    },
    {
        field: 'twitterLink',
        headerName: 'Twitter Link',
        width: 250,
        renderCell: (params) => (
            <a href={params.value} target="_blank" rel="noopener noreferrer">
                {params.value}
            </a>
        ),
    },
    {
        field: 'paragraph3',
        headerName: 'Paragraph3',
        width: 200,
        renderCell: (params) => (
            <div dangerouslySetInnerHTML={{ __html: params.value ? params.value.replace(/\n/g, '<br>') : '' }} />
        ),
    },
    {
        field: 'ImageUrl',
        headerName: 'Image',
        width: 150,
        renderCell: (params) => (
            params.value ? <img src={params.value} alt="Selected" style={{ width: '100%', height: 'auto' }} /> : null
        ),
    },
];


export default function LandingPagesTable() {
    const [rows, setRows] = React.useState<LandingPages[]>([]);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [formData, setFormData] = React.useState({
        CountdownDate: '',
        title: '',
        paragraph1: '',
        paragraph2: '',
        paragraph3: '',
        name: '',
        twitterLink: '',
    });

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = new Headers();
                headers.set('Content-Type', 'application/json');
                if (config.apiKey) {
                    headers.set('x-api-key', config.apiKey);
                }

                const response = await fetch(config.apiUrl + `/landing-pages`, {
                    headers: headers,
                });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClickOpen = () => {
        setEditMode(false);
        setFormData({
            CountdownDate: '',
            title: '',
            paragraph1: '',
            paragraph2: '',
            paragraph3: '',
            name: '',
            twitterLink: '',
        });
        setSelectedImage(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleSubmit = async () => {
        let imageUrl = '';

        if (imageInputRef.current?.files?.[0]) {
            const imageData = new FormData();
            imageData.append('file', imageInputRef.current.files[0]);

            try {
                const headers = new Headers();
                if (config.apiKey) {
                    headers.set('x-api-key', config.apiKey);
                }

                const imageUploadResponse = await fetch(config.apiUrl + '/upload-image', {
                    method: 'POST',
                    headers: headers,
                    body: imageData,
                });
                const imageUploadData = await imageUploadResponse.json();
                imageUrl = imageUploadData.imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        const requestData = {
            ...formData,
            ImageUrl: imageUrl,
        };

        try {
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            if (config.apiKey) {
                headers.set('x-api-key', config.apiKey);
            }

            const url = editMode ? `${config.apiUrl}/landing-pages/${selectedId}` : `${config.apiUrl}/landing-pages`;
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(requestData),
            });
            const data: LandingPages = await response.json();

            if (editMode) {
                setRows((prevRows) => prevRows.map((row) => {
                    const id = typeof row._id === 'object' ? row._id.$oid : row._id;
                    return id === selectedId ? data : row;
                }));
            } else {
                setRows((prevRows) => [...prevRows, data]);
            }

            handleClose();
        } catch (error) {
            console.error(`Error ${editMode ? 'updating' : 'registering'} LandingPage:`, error);
        }
    };


    const handleRowDoubleClick = (params: GridRowParams) => {
        setSelectedId(params.id as string);
        const rowData = rows.find((row) => {
            const id = typeof row._id === 'object' ? row._id.$oid : row._id;
            return id === params.id;
        });

        if (rowData) {
            setFormData({
                CountdownDate: rowData.CountdownDate,
                title: rowData.title,
                paragraph1: rowData.paragraph1,
                paragraph2: rowData.paragraph2,
                paragraph3: rowData.paragraph3,
                name: rowData.name || '',
                twitterLink: rowData.twitterLink || '',
            });
            setSelectedImage(rowData.ImageUrl || null);
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
                fetch(`${config.apiUrl}/landing-pages/${id}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'x-api-key': config.apiKey || '',
                    }),
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
                .catch((error) => console.error('Error deleting Landing Pages:', error));
        }
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
                <DialogTitle>{editMode ? 'Edit Landing Page' : 'Register New Landing Page'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="CountdownDate"
                        label="CountdownDate"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={formData.CountdownDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="paragraph1"
                        label="Paragraph1"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={formData.paragraph1}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="paragraph2"
                        label="Paragraph2"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={formData.paragraph2}
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
                        onChange={handleChange} // New name field
                    />
                    <TextField
                        margin="dense"
                        name="twitterLink"
                        label="Twitter Link"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={formData.twitterLink}
                        onChange={handleChange} // New Twitter link field
                    />
                    <TextField
                        margin="dense"
                        name="paragraph3"
                        label="Paragraph3"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={formData.paragraph3}
                        onChange={handleChange}
                    />
                    <div className="file-input-container">
                        <div className="custom-file-button">Select Image</div>
                        <input
                            type="file"
                            ref={imageInputRef}
                            accept="image/*"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                    </div>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Selected"
                            style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                        />
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
        </div>
    );
}
*/


import * as React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';
import './LandingPagesTable.css';

// Define an interface that matches the structure of your data
interface LandingPages {
    _id: { $oid: string } | string;
    CountdownDate: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    ImageUrl?: string;
    name?: string;
    twitterLink?: string;
}

const columns: GridColDef[] = [
    { field: 'CountdownDate', headerName: 'CountdownDate', width: 200 },
    { field: 'title', headerName: 'Title', width: 200 },
    {
        field: 'paragraph1',
        headerName: 'Paragraph1',
        width: 200,
        renderCell: (params) => (
            <div dangerouslySetInnerHTML={{ __html: params.value ? params.value.replace(/\n/g, '<br>') : '' }} />
        ),
    },
    {
        field: 'paragraph2',
        headerName: 'Paragraph2',
        width: 200,
        renderCell: (params) => (
            <div dangerouslySetInnerHTML={{ __html: params.value ? params.value.replace(/\n/g, '<br>') : '' }} />
        ),
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
    },
    {
        field: 'twitterLink',
        headerName: 'Twitter Link',
        width: 250,
        renderCell: (params) => (
            <a href={params.value} target="_blank" rel="noopener noreferrer">
                {params.value}
            </a>
        ),
    },
    {
        field: 'paragraph3',
        headerName: 'Paragraph3',
        width: 200,
        renderCell: (params) => (
            <div dangerouslySetInnerHTML={{ __html: params.value ? params.value.replace(/\n/g, '<br>') : '' }} />
        ),
    },
    {
        field: 'ImageUrl',
        headerName: 'Image',
        width: 150,
        renderCell: (params) => (
            params.value ? <img src={params.value} alt="Selected" style={{ width: '100%', height: 'auto' }} /> : null
        ),
    },
];

export default function LandingPagesTable() {
    const [rows, setRows] = React.useState<LandingPages[]>([]);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [formData, setFormData] = React.useState({
        CountdownDate: '',
        title: '',
        paragraph1: '',
        paragraph2: '',
        paragraph3: '',
        name: '',
        twitterLink: '',
    });

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = new Headers();
                headers.set('Content-Type', 'application/json');
                if (config.apiKey) {
                    headers.set('x-api-key', config.apiKey);
                }

                const response = await fetch(config.apiUrl + `/landing-pages`, {
                    headers: headers,
                });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClickOpen = () => {
        setEditMode(false);
        setFormData({
            CountdownDate: '',
            title: '',
            paragraph1: '',
            paragraph2: '',
            paragraph3: '',
            name: '',
            twitterLink: '',
        });
        setSelectedImage(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleSubmit = async () => {
        let imageUrl = '';

        if (imageInputRef.current?.files?.[0]) {
            const imageData = new FormData();
            imageData.append('file', imageInputRef.current.files[0]);

            try {
                const headers = new Headers();
                if (config.apiKey) {
                    headers.set('x-api-key', config.apiKey);
                }

                const imageUploadResponse = await fetch(config.apiUrl + '/upload-image', {
                    method: 'POST',
                    headers: headers,
                    body: imageData,
                });
                const imageUploadData = await imageUploadResponse.json();
                imageUrl = imageUploadData.imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        const requestData = {
            ...formData,
            ImageUrl: imageUrl,
        };

        try {
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            if (config.apiKey) {
                headers.set('x-api-key', config.apiKey);
            }

            const url = editMode ? `${config.apiUrl}/landing-pages/${selectedId}` : `${config.apiUrl}/landing-pages`;
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(requestData),
            });
            const data: LandingPages = await response.json();

            if (editMode) {
                setRows((prevRows) => prevRows.map((row) => {
                    const id = typeof row._id === 'object' ? row._id.$oid : row._id;
                    return id === selectedId ? data : row;
                }));
            } else {
                setRows((prevRows) => [...prevRows, data]);
            }

            handleClose();
        } catch (error) {
            console.error(`Error ${editMode ? 'updating' : 'registering'} LandingPage:`, error);
        }
    };

    const handleRowDoubleClick = (params: GridRowParams) => {
        setSelectedId(params.id as string);
        const rowData = rows.find((row) => {
            const id = typeof row._id === 'object' ? row._id.$oid : row._id;
            return id === params.id;
        });

        if (rowData) {
            setFormData({
                CountdownDate: rowData.CountdownDate,
                title: rowData.title,
                paragraph1: rowData.paragraph1,
                paragraph2: rowData.paragraph2,
                paragraph3: rowData.paragraph3,
                name: rowData.name || '',
                twitterLink: rowData.twitterLink || '',
            });
            setSelectedImage(rowData.ImageUrl || null);
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
                fetch(`${config.apiUrl}/landing-pages/${id}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'x-api-key': config.apiKey || '',
                    }),
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
                .catch((error) => console.error('Error deleting Landing Pages:', error));
        }
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
                <DialogTitle>{editMode ? 'Edit Landing Page' : 'Register New Landing Page'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="CountdownDate"
                        label="CountdownDate"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={formData.CountdownDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="paragraph1"
                        label="Paragraph1"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={formData.paragraph1}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="paragraph2"
                        label="Paragraph2"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={formData.paragraph2}
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
                        onChange={handleChange} // New name field
                    />
                    <TextField
                        margin="dense"
                        name="twitterLink"
                        label="Twitter Link"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={formData.twitterLink}
                        onChange={handleChange} // New Twitter link field
                    />
                    <TextField
                        margin="dense"
                        name="paragraph3"
                        label="Paragraph3"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={formData.paragraph3}
                        onChange={handleChange}
                    />
                    <div className="file-input-container">
                        <div className="custom-file-button">Select Image</div>
                        <input
                            type="file"
                            ref={imageInputRef}
                            accept="image/*"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                    </div>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Selected"
                            style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                        />
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
        </div>
    );
}
