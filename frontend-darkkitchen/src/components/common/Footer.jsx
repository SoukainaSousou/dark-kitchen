// src/components/common/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Section Logo et Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DeliveryDiningIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontFamily: '"Pacifico", cursive',
                }}
              >
                TasteLab
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, color: 'grey.300' }}>
              Votre cuisine virtuelle d'excellence. Des plats créatifs préparés avec passion 
              et livrés en moins de 30 minutes.
            </Typography>
            
            {/* Réseaux sociaux */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'primary.main' }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'primary.main' }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'primary.main' }
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Navigation rapide */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/" 
                sx={{ 
                  color: 'grey.300', 
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Accueil
              </Link>
              <Link 
                component={RouterLink} 
                to="/categories" 
                sx={{ 
                  color: 'grey.300', 
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Catégories
              </Link>
              <Link 
                component={RouterLink} 
                to="/menu" 
                sx={{ 
                  color: 'grey.300', 
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Notre Menu
              </Link>
              <Link 
                component={RouterLink} 
                to="/delivery" 
                sx={{ 
                  color: 'grey.300', 
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Livraison
              </Link>
            </Box>
          </Grid>

          {/* Contact et Horaires côte à côte */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
              Contact & Horaires
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Contact */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.875rem' }}>
                    +33 1 45 67 89 10
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.875rem' }}>
                    contact@tastelab.fr
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main', mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.875rem' }}>
                    123 Rue de la Gastronomie<br />
                    75011 Oujda, Maroc
                  </Typography>
                </Box>
              </Box>

              {/* Horaires */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    Horaires
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.875rem' }}>
                  Lundi - Dimanche<br />
                  11h00 - 23h00
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'grey.700' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} TasteLab - Cuisine Virtuelle. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;