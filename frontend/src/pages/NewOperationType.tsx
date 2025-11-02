import React from 'react';
import {Container} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {CreateOperationTypeForm} from '../components/forms/CreateOperationTypeForm';

export const NewOperationType: React.FC = () => {
    const navigate = useNavigate();

    const handleOperationTypeCreated = () => {
        navigate('/');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md" sx={{mt: 4, mb: 4}}>
            <CreateOperationTypeForm
                onOperationTypeCreated={handleOperationTypeCreated}
                onCancel={handleCancel}
            />
        </Container>
    );
};
