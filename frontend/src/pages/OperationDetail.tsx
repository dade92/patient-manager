import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Operation } from '../types/operation';
import { useCache } from '../context/CacheContext';

export const OperationDetail: React.FC = () => {
  const { operationId } = useParams();
  const navigate = useNavigate();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the cache context
  const { getCachedOperation, setCachedOperation } = useCache();

  useEffect(() => {
    const fetchOperation = async () => {
      if (!operationId) return;

      // Check if operation is in cache
      const cachedOperation = getCachedOperation(operationId);
      if (cachedOperation) {
        setOperation(cachedOperation);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/operations/${operationId}`);
        if (response.ok) {
          const data = await response.json();
          setOperation(data);
          // Store in cache
          setCachedOperation(operationId, data);
        } else if (response.status === 404) {
          setError(`Operation with ID ${operationId} was not found`);
          setOperation(null);
        } else {
          setError('An error occurred while fetching the operation data');
        }
      } catch (error) {
        setError('An error occurred while fetching the operation data');
        console.error('Error fetching operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperation();
  }, [operationId, getCachedOperation, setCachedOperation]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : operation ? (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" component="div">
                {operation.type}
              </Typography>
              <Chip
                label={`Patient ID: ${operation.patientId}`}
                color="primary"
                onClick={() => navigate(`/patient/${operation.patientId}`)}
                clickable
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">Description</Typography>
                <Typography variant="body1" paragraph>
                  {operation.description}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="textSecondary">Executor</Typography>
                <Typography variant="body1" paragraph>
                  {operation.executor}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="textSecondary">Date</Typography>
                <Typography variant="body1" paragraph>
                  {formatDate(operation.createdAt)}
                </Typography>
              </Grid>

              {operation.assets && operation.assets.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Assets
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {operation.assets.map((asset, index) => (
                      <Link
                        key={index}
                        href={`/files?filename=${asset}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        <Chip
                          icon={<AttachFileIcon />}
                          label={asset}
                          variant="outlined"
                          clickable
                        />
                      </Link>
                    ))}
                  </Box>
                </Grid>
              )}

              {operation.additionalNotes && operation.additionalNotes.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Notes
                  </Typography>
                  <List>
                    {operation.additionalNotes.map((note, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={note.content}
                            secondary={formatDate(note.createdAt)}  //TODO this should not be done. BE should return the date in a more readable format
                          />
                        </ListItem>
                        {index < operation.additionalNotes.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ) : null}
    </Box>
  );
};
