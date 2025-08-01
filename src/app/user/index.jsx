import { Box, Button, Chip, CircularProgress, Grid, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../redux/userListSlice";
import { DataGrid } from '@mui/x-data-grid';
import { fetchUserRoles } from "../redux/userRoleSlice";
import { useNavigate } from "react-router-dom";
import { windowWidth } from "../../utills";
import { updateUser } from "../redux/updateUserSlice";
import { Loader } from "../../components/loader";


const ListAllUsers = () => {
    const screenWidth = windowWidth()
    const userRoles = useSelector((state) => state.userRole.roles);
    const userList = useSelector((state) => state.userList.data);
    const { loading, error } = useSelector((state) => state.updateUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const [open, setOpen] = React.useState(false);

      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
    useEffect(() => {
        dispatch(fetchUsersList({})).then(res => {
            if (res?.payload) {
                dispatch(fetchUserRoles({})); // Dispatch again to ensure data is updated in the store
            } else {
                console.error('Failed to fetch users:', res.error);
            }
        }); // Fetch users data with empty object or any required parameters
    }, []);
    const modifyUser = (e) => {
        const userId = e.row._id;
        const userData = safeRows.find(userList => userList._id === userId);
        if (userData) {
            console.log('User data to modify:', userData);
            // Here you can implement the logic to modify the user data
            // For example, you can navigate to a user modification page or open a modal
            navigate(`/modify-user/${userId}`, { state: { user: userData, role: userRoles } });
        } else {
            console.error('User not found for modification:', userId);
        }
    }
    const markActive = (e) => {
         setOpen(true);
        const userId = e.row._id;
         const userData = safeRows.find(userList => userList._id === userId);
        if (userId) {
            const data = {
                firstname: userData.firstname,
                lastname: userData.lastname,
                mobilenumber: userData.mobilenumber,
                email: userData.email,
                role: userData.role, // Default role, can be changed as needed
                status: userData.status == 1 ? 0 : 1  // Assuming 1 is for active status
            }

            dispatch(updateUser(userId, data))
                .then((response) => {
                    if (response.error) {
                        // setErrorTxt(response.error.message);
                    } else if (loading) {
                       
                        // setErrorTxt('Please Wait We Are Registering The user...');
                    } else { 
                        // setErrorTxt('User Updation Successful');
                        dispatch(fetchUsersList({})).then(() => {
                            setOpen(false);
                        }); // Refresh the user list after successful update
                        // window.location.href = routesName.LIST_ALL_USERS; // Redirect to login page after successful registration
                    }
                });
            
        } else {
            console.error('User not found for marking active:', userId);
        }
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'status', renderCell: (params) =>
            (
                <Chip sx={{ width: 80 }} label={params.value} color={params.value == 'Active' ? 'success' : 'error'} />
            ), headerName: 'Status', width: 120
        },
        {
            field: '',
            renderCell: (e) => (
                <>
                    <Button label="Modify" variant="outlined" color="warning" onClick={() => modifyUser(e)} >Modify</Button>
                    <Button label="Modify" variant="outlined" color={e.row?.status == 'Active' ? 'success' : 'error'} onClick={() => markActive(e)} sx={{ marginLeft: 1 }}>{e.row?.status == 'Active' ? 'InActive' : 'Activate'}</Button>
                </>
            ),
            headerName: 'Modify', width: 280
        },
    ];
    const paginationModel = { pageSize: 5, page: 0 };

    const safeRows = userList.map((row, idx) => ({
        ...row,
        id: row.id ?? idx + 1, // Use existing id or fallback to index
        role: row?.role?.rolename ? row?.role?.rolename : 'Unknown', // Map role ID to role name
        status: row.status == 1 ? 'Active' : 'Inactive', // Map boolean status to string
    }));

    //export user Data to exvcel or csv
    const exportUsers = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            columns.map(col => col.headerName).join(",") + "\n" +
            safeRows.map(row => columns.map(col => row[col.field]).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link); // Clean up
    };
    // Function to handle user modification

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
                <Typography variant="h5" color="textSecondary">
                    List of All Users
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => dispatch(fetchUsersList({}))}>
                    Refresh
                </Button>
                <Button variant="contained" color="secondary" sx={{ marginLeft: '10px' }} onClick={() => window.location.href = '/add-user'}>
                    Add User
                </Button>
                <Button variant="contained" color="success" sx={{ marginLeft: '10px' }} onClick={() => exportUsers()}>
                    Export Users
                </Button>
            </Box>
            <Grid item xs={12} sx={{ justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
                <Paper sx={{ width: '100%' }}>
                    <DataGrid
                        rows={safeRows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        sx={{ border: 0, width: '100%' }}
                    />
                </Paper>
            </Grid>

           <Loader open={open}/>
        </Box>
    );
}
export default ListAllUsers;