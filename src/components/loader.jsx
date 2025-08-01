import { Box, CircularProgress, Modal } from "@mui/material"

export const Loader = ({open, handleClose}) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <CircularProgress />
                <p style={{ marginTop: '16px' }}>Loading data...</p>
            </Box>
        </Modal>
    )
}