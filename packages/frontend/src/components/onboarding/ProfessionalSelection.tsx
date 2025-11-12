import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Button
} from '@mui/material';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

interface ProfessionalSelectionProps {
  selectedProfessional: string | null;
  onProfessionalSelect: (professionalId: string) => void;
  onSkip: () => void;
}

export const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
  selectedProfessional,
  onProfessionalSelect,
  onSkip
}) => {
  // Mock professionals (replace with API data if available)
  const professionals: Professional[] = [
    { id: 'p1', name: 'John Doe', specialty: 'Chartered Accountant' },
    { id: 'p2', name: 'Priya Sharma', specialty: 'Financial Consultant' },
    { id: 'p3', name: 'Rahul Verma', specialty: 'Business Advisor' }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Choose a Professional
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" mb={3}>
        Select a professional to assist you during onboarding (optional)
      </Typography>

      <Grid container spacing={3}>
        {professionals.map((pro) => (
          <Grid item xs={12} sm={6} md={4} key={pro.id}>
            <Card
              sx={{
                border: selectedProfessional === pro.id ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: 2
              }}
            >
              <CardActionArea onClick={() => onProfessionalSelect(pro.id)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={pro.avatarUrl}
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#1976d2'
                    }}
                  >
                    {pro.name.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1">{pro.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {pro.specialty}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="outlined" color="secondary" onClick={onSkip}>
          Skip
        </Button>
      </Box>
    </Box>
  );
};
