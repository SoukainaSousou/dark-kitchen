import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardMedia, IconButton, TextField, Divider, Paper, Alert as MuiAlert,
  CircularProgress, Stepper, Step, StepLabel, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { orderService, authService } from '../services/api';

const steps = ['Panier', 'Authentification', 'Informations', 'Confirmation'];

// Créer un composant Alert personnalisé pour Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Cart = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // États pour l'authentification
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [authData, setAuthData] = useState({
    loginEmail: '',
    loginPassword: '',
    registerEmail: '',
    registerPassword: '',
    registerConfirmPassword: '',
    registerFullName: '',
    registerPhone: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Informations client
  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    notes: '',
    email: '',
    password: ''
  });

  // Charger le panier et vérifier l'authentification
  useEffect(() => {
    const loadCartAndUser = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
      
      // Vérifier si l'utilisateur est connecté
      const user = authService.getCurrentUser();
      console.log('Cart: Loaded user:', user);
      
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setClientInfo(prev => ({
          ...prev,
          fullName: user.fullName || '',
          phoneNumber: user.phoneNumber || '',
          email: user.email || '',
          deliveryAddress: user.address || user.deliveryAddress || ''
        }));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };

    loadCartAndUser();
    
    // Écouter les événements de mise à jour
    const handleUserUpdated = () => {
      console.log('Cart: User updated event received');
      loadCartAndUser();
    };
    
    window.addEventListener('storage', loadCartAndUser);
    window.addEventListener('userUpdated', handleUserUpdated);
    
    return () => {
      window.removeEventListener('storage', loadCartAndUser);
      window.removeEventListener('userUpdated', handleUserUpdated);
    };
  }, []);

  // Calculer le total
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const tax = subtotal * 0.10;
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // Gérer la quantité
  const handleQuantityChange = (itemId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    showSnackbar('Quantité mise à jour', 'success');
  };

  // Supprimer un item
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    showSnackbar('Article retiré du panier', 'info');
  };

  // Vider le panier
  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider tout le panier ?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      showSnackbar('Panier vidé', 'info');
    }
  };

  // Afficher un snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Gérer la connexion
  const handleLogin = async () => {
    setAuthError('');
    setAuthLoading(true);
    
    if (!authData.loginEmail || !authData.loginPassword) {
      setAuthError('Veuillez remplir tous les champs');
      setAuthLoading(false);
      return;
    }
    
    try {
      const result = await authService.login(authData.loginEmail, authData.loginPassword);
      
      if (result.success) {
        setIsAuthenticated(true);
        setCurrentUser(result.user || result.client);
        setClientInfo(prev => ({
          ...prev,
          fullName: (result.user || result.client).fullName || '',
          phoneNumber: (result.user || result.client).phoneNumber || '',
          email: (result.user || result.client).email || '',
          deliveryAddress: (result.user || result.client).address || (result.user || result.client).deliveryAddress || ''
        }));
        
        setShowAuthModal(false);
        setAuthError('');
        showSnackbar('Connexion réussie !', 'success');
        
        // Passer à l'étape suivante
        setActiveStep(2);
      } else {
        setAuthError(result.message);
      }
    } catch (err) {
      setAuthError('Erreur de connexion. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Gérer l'inscription
  const handleRegister = async () => {
    setAuthError('');
    setAuthLoading(true);
    
    // Validation
    if (!authData.registerEmail || !authData.registerPassword || 
        !authData.registerFullName || !authData.registerPhone) {
      setAuthError('Veuillez remplir tous les champs obligatoires');
      setAuthLoading(false);
      return;
    }
    
    if (authData.registerPassword !== authData.registerConfirmPassword) {
      setAuthError('Les mots de passe ne correspondent pas');
      setAuthLoading(false);
      return;
    }
    
    if (authData.registerPassword.length < 6) {
      setAuthError('Le mot de passe doit faire au moins 6 caractères');
      setAuthLoading(false);
      return;
    }
    
    try {
      const userData = {
        email: authData.registerEmail,
        password: authData.registerPassword,
        fullName: authData.registerFullName,
        phoneNumber: authData.registerPhone
      };
      
      const result = await authService.register(userData);
      
      if (result.success) {
        setIsAuthenticated(true);
        setCurrentUser(result.user);
        setClientInfo(prev => ({
          ...prev,
          fullName: result.user.fullName,
          phoneNumber: result.user.phoneNumber,
          email: result.user.email,
          deliveryAddress: result.user.address || ''
        }));
        
        setShowAuthModal(false);
        setAuthError('');
        showSnackbar('Compte créé avec succès !', 'success');
        
        // Passer à l'étape suivante
        setActiveStep(2);
      } else {
        setAuthError(result.message);
      }
    } catch (err) {
      setAuthError('Erreur lors de l\'inscription');
      console.error('Register error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Continuer vers l'étape suivante
  const handleNext = async () => {
    setError(null);
    
    if (activeStep === 0 && cartItems.length === 0) {
      setError('Votre panier est vide');
      return;
    }
    
    if (activeStep === 1) {
      // Étape d'authentification
      if (!clientInfo.email) {
        setError('Veuillez entrer votre email');
        return;
      }
      
      if (!/\S+@\S+\.\S+/.test(clientInfo.email)) {
        setError('Veuillez entrer un email valide');
        return;
      }
      
      // Vérifier si l'utilisateur est déjà connecté
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.email === clientInfo.email) {
        setIsAuthenticated(true);
        setActiveStep(2);
        return;
      }
      
      try {
        const exists = await orderService.checkClientExists(clientInfo.email);
        
        if (exists) {
          // Afficher la modale de connexion
          setAuthTab(0);
          setAuthData(prev => ({ 
            ...prev, 
            loginEmail: clientInfo.email,
            loginPassword: ''
          }));
          setShowAuthModal(true);
          return;
        } else {
          // Afficher la modale d'inscription
          setAuthTab(1);
          setAuthData(prev => ({ 
            ...prev, 
            registerEmail: clientInfo.email,
            registerFullName: clientInfo.fullName || '',
            registerPhone: clientInfo.phoneNumber || '',
            registerPassword: '',
            registerConfirmPassword: ''
          }));
          setShowAuthModal(true);
          return;
        }
      } catch (err) {
        setError('Erreur de vérification. Veuillez réessayer.');
        return;
      }
    }
    
    if (activeStep === 2) {
      // Valider les informations
      if (!clientInfo.fullName.trim()) {
        setError('Le nom complet est requis');
        return;
      }
      if (!clientInfo.phoneNumber.trim()) {
        setError('Le numéro de téléphone est requis');
        return;
      }
      if (!/^[0-9+\s]{10,}$/.test(clientInfo.phoneNumber.replace(/\s/g, ''))) {
        setError('Veuillez entrer un numéro de téléphone valide');
        return;
      }
      if (!clientInfo.deliveryAddress.trim()) {
        setError('L\'adresse de livraison est requise');
        return;
      }
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Soumettre la commande
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Préparer les données de commande
      const orderData = {
        clientInfo: {
          fullName: clientInfo.fullName,
          email: clientInfo.email,
          phoneNumber: clientInfo.phoneNumber,
          deliveryAddress: clientInfo.deliveryAddress
        },
        items: cartItems.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        notes: clientInfo.notes,
        totalAmount: parseFloat(totals.total)
      };

      console.log('Submitting order data:', orderData);

      // Créer la commande
      const result = await orderService.createOrder(orderData);

      if (result.success || result.orderId) {
        // Succès
        setOrderId(result.orderId || result.id);
        setSuccess(true);
        
        // Sauvegarder l'utilisateur si création de compte
        if (result.clientId || result.client) {
          const userData = {
            id: result.clientId || result.client?.id,
            email: clientInfo.email,
            fullName: clientInfo.fullName,
            phoneNumber: clientInfo.phoneNumber,
            address: clientInfo.deliveryAddress
          };
          authService.saveUser(userData);
        }
        
        // Vider le panier
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Passer à l'étape de confirmation
        setActiveStep(3);
        
        showSnackbar('Commande confirmée avec succès !', 'success');
      } else {
        throw new Error(result.message || 'Erreur lors de la commande');
      }

    } catch (err) {
      console.error('Erreur de commande:', err);
      setError(err.message || 'Erreur lors de la commande');
      showSnackbar(err.message || 'Erreur lors de la commande', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Continuer les achats
  const handleContinueShopping = () => {
    navigate('/menu');
  };

  // Voir la commande
  const handleViewOrder = () => {
   // if (orderId) {
    //  navigate(`/orders/${orderId}`);
   // }

     navigate('/myorders');
  };

  // Étape 1 : Panier (inchangé)
  const renderCartStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Votre Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
      </Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 3, borderRadius: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
            Votre panier est vide
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Ajoutez des plats délicieux pour commencer vos achats
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleContinueShopping}
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Explorer le Menu
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.50' }}>
                <TableRow>
                  <TableCell width="40%">Plat</TableCell>
                  <TableCell>Prix unitaire</TableCell>
                  <TableCell align="center" width="150px">Quantité</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center" width="80px">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.image || '/default-dish.jpg'}
                          alt={item.name}
                          sx={{ 
                            width: 70, 
                            height: 70, 
                            borderRadius: 1, 
                            objectFit: 'cover',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          {item.category && (
                            <Chip 
                              label={item.category} 
                              size="small" 
                              sx={{ mt: 0.5 }}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="#e91e63">
                        {item.price.toFixed(2)}€
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        py: 0.5,
                        px: 1,
                        width: 'fit-content',
                        mx: 'auto'
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ 
                            width: 28, 
                            height: 28,
                            '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          sx={{ 
                            width: 28, 
                            height: 28,
                            '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {(item.price * item.quantity).toFixed(2)}€
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{ 
                          '&:hover': { backgroundColor: 'error.light', color: 'white' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Résumé */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleClearCart}
                  startIcon={<DeleteIcon />}
                >
                  Vider le panier
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleContinueShopping}
                  startIcon={<ShoppingCartIcon />}
                >
                  Continuer mes achats
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Résumé
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Sous-total:</Typography>
                    <Typography variant="body1">{totals.subtotal}€</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Frais de livraison:</Typography>
                    <Typography variant="body1">{totals.deliveryFee}€</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">TVA (10%):</Typography>
                    <Typography variant="body1">{totals.tax}€</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h5" fontWeight="bold" color="#e91e63">
                      {totals.total}€
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );

  // Étape 2 : Authentification
  const renderAuthStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Authentification
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pour finaliser votre commande, veuillez vous identifier
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EmailIcon sx={{ mr: 2, color: 'primary.main', fontSize: 30 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Entrez votre email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nous vérifierons si vous avez déjà un compte
                </Typography>
              </Box>
            </Box>
            
            <TextField
              fullWidth
              label="Votre email *"
              type="email"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
              placeholder="exemple@email.com"
              required
              error={!!error && error.includes('email')}
              helperText={error && error.includes('email') ? error : ''}
              sx={{ mb: 3 }}
            />
            
            {isAuthenticated && currentUser && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Vous êtes déjà connecté en tant que: {currentUser.fullName}
                </Typography>
              </Alert>
            )}
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Si vous avez déjà un compte, vous serez invité à vous connecter.
              Sinon, vous pourrez créer un compte rapidement.
            </Alert>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: '100%', backgroundColor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                Avantages d'un compte
              </Typography>
              <ul style={{ paddingLeft: 20, color: 'text.secondary' }}>
                <li><Typography variant="body2">Suivi de vos commandes en temps réel</Typography></li>
                <li><Typography variant="body2">Historique de vos commandes</Typography></li>
                <li><Typography variant="body2">Adresses de livraison enregistrées</Typography></li>
                <li><Typography variant="body2">Offres spéciales et promotions</Typography></li>
                <li><Typography variant="body2">Paiement plus rapide</Typography></li>
              </ul>
              
              {isAuthenticated && currentUser && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Vous êtes connecté en tant que: {currentUser.fullName}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Étape 3 : Informations (inchangé)
  const renderInfoStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Vos Informations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Remplissez vos informations pour la livraison
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nom complet *"
            value={clientInfo.fullName}
            onChange={(e) => setClientInfo({...clientInfo, fullName: e.target.value})}
            required
            error={!!error && error.includes('nom')}
            helperText={error && error.includes('nom') ? error : ''}
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Téléphone *"
            value={clientInfo.phoneNumber}
            onChange={(e) => setClientInfo({...clientInfo, phoneNumber: e.target.value})}
            required
            error={!!error && error.includes('téléphone')}
            helperText={error && error.includes('téléphone') ? error : 'Format: 06 12 34 56 78'}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Adresse de livraison *"
            value={clientInfo.deliveryAddress}
            onChange={(e) => setClientInfo({...clientInfo, deliveryAddress: e.target.value})}
            required
            error={!!error && error.includes('adresse')}
            helperText={error && error.includes('adresse') ? error : 'Ex: 123 Rue de la Paix, 75001 Paris'}
            multiline
            rows={2}
            InputProps={{
              startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes pour la livraison (optionnel)"
            value={clientInfo.notes}
            onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
            multiline
            rows={3}
            placeholder="Ex: Sonner 2 fois, porte à gauche, interphone: Durand, ne pas sonner après 22h, etc."
            InputProps={{
              startAdornment: <NotesIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
            }}
          />
        </Grid>
        
        {/* Rappel des articles */}
        <Grid item xs={12}>
          <Card sx={{ mt: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Récapitulatif de votre commande:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {cartItems.slice(0, 5).map((item, index) => (
                  <Chip 
                    key={item.id}
                    label={`${item.quantity}x ${item.name}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {cartItems.length > 5 && (
                  <Chip 
                    label={`+${cartItems.length - 5} autres`}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total: <span style={{ fontWeight: 'bold', color: '#e91e63' }}>{totals.total}€</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Étape 4 : Récapitulatif (inchangé)
  const renderSummaryStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Récapitulatif de commande
      </Typography>

      <Grid container spacing={3}>
        {/* Informations client */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations client
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Nom:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {clientInfo.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {clientInfo.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text-secondary">
                    Téléphone:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {clientInfo.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text-secondary">
                    Adresse:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {clientInfo.deliveryAddress}
                  </Typography>
                </Grid>
                {clientInfo.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text-secondary">
                      Notes:
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{clientInfo.notes}"
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Récapitulatif des articles */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Détails de la commande
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {cartItems.map((item, index) => (
                <Box key={item.id} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  pb: 2,
                  borderBottom: index < cartItems.length - 1 ? '1px dashed' : 'none',
                  borderColor: 'divider'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={item.image || '/default-dish.jpg'}
                      alt={item.name}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: 1, 
                        objectFit: 'cover' 
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text-secondary">
                        {item.quantity} × {item.price.toFixed(2)}€
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {(item.price * item.quantity).toFixed(2)}€
                  </Typography>
                </Box>
              ))}

              {/* Total */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Sous-total:</Typography>
                  <Typography variant="body1">{totals.subtotal}€</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Frais de livraison:</Typography>
                  <Typography variant="body1">{totals.deliveryFee}€</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">TVA (10%):</Typography>
                  <Typography variant="body1">{totals.tax}€</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#e91e63">
                    {totals.total}€
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Étape de confirmation (inchangé)
  const renderConfirmationStep = () => (
    <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 600, mx: 'auto', borderRadius: 3 }}>
      {success ? (
        <>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
            Commande confirmée !
          </Typography>
          <Typography variant="h6" gutterBottom>
            Merci pour votre commande {clientInfo.fullName}
          </Typography>
          <Typography variant="body1" color="text-secondary" sx={{ mb: 3 }}>
            Votre commande <strong>#{orderId}</strong> a été enregistrée avec succès.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2" fontWeight="bold">
              Informations importantes:
            </Typography>
            <Typography variant="body2">
              • Temps de livraison estimé: <strong>25-30 minutes</strong><br/>
              • Moyen de paiement: <strong>À la livraison</strong><br/>
              • Un SMS de confirmation vous sera envoyé
            </Typography>
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={handleViewOrder}
              size="large"
              sx={{ 
                backgroundColor: '#e91e63',
                '&:hover': { backgroundColor: '#ad1457' }
              }}
            >
              Suivre ma commande
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleContinueShopping}
              size="large"
            >
              Retour au menu
            </Button>
          </Box>
        </>
      ) : (
        <>
          <CircularProgress size={60} sx={{ mb: 3, color: '#e91e63' }} />
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Traitement de votre commande...
          </Typography>
          <Typography variant="body2" color="text-secondary">
            Veuillez patienter pendant que nous validons votre commande.
          </Typography>
        </>
      )}
    </Paper>
  );

  // Modale d'authentification (inchangé)
  const renderAuthModal = () => (
    <Dialog 
      open={showAuthModal} 
      onClose={() => setShowAuthModal(false)} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {authTab === 0 ? 'Connexion à votre compte' : 'Créer un nouveau compte'}
        </Typography>
        <Typography variant="body2" color="text-secondary">
          {authTab === 0 
            ? 'Entrez vos identifiants pour accéder à votre compte' 
            : 'Créez votre compte en quelques secondes'}
        </Typography>
      </DialogTitle>
      
      <Tabs 
        value={authTab} 
        onChange={(e, v) => {
          setAuthTab(v);
          setAuthError('');
        }} 
        centered
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Connexion" />
        <Tab label="Inscription" />
      </Tabs>

      <DialogContent sx={{ pt: 3 }}>
        {authTab === 0 ? (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={authData.loginEmail}
              onChange={(e) => setAuthData({...authData, loginEmail: e.target.value})}
              sx={{ mb: 2 }}
              autoFocus
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={authData.loginPassword}
              onChange={(e) => setAuthData({...authData, loginPassword: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Typography variant="body2" color="text-secondary" sx={{ mt: 1, textAlign: 'right' }}>
              Mot de passe oublié ?
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nom complet *"
              value={authData.registerFullName}
              onChange={(e) => setAuthData({...authData, registerFullName: e.target.value})}
              sx={{ mb: 2 }}
              autoFocus
            />
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={authData.registerEmail}
              onChange={(e) => setAuthData({...authData, registerEmail: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Téléphone *"
              value={authData.registerPhone}
              onChange={(e) => setAuthData({...authData, registerPhone: e.target.value})}
              sx={{ mb: 2 }}
              placeholder="06 12 34 56 78"
            />
            <TextField
              fullWidth
              label="Mot de passe *"
              type="password"
              value={authData.registerPassword}
              onChange={(e) => setAuthData({...authData, registerPassword: e.target.value})}
              sx={{ mb: 2 }}
              helperText="Minimum 6 caractères"
            />
            <TextField
              fullWidth
              label="Confirmer le mot de passe *"
              type="password"
              value={authData.registerConfirmPassword}
              onChange={(e) => setAuthData({...authData, registerConfirmPassword: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
            />
          </Box>
        )}
        
        {authError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {authError}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={() => setShowAuthModal(false)} 
          color="inherit"
          disabled={authLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={authTab === 0 ? handleLogin : handleRegister}
          variant="contained"
          disabled={authLoading}
          sx={{ 
            backgroundColor: '#e91e63',
            '&:hover': { backgroundColor: '#ad1457' }
          }}
        >
          {authLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : authTab === 0 ? (
            'Se connecter'
          ) : (
            'Créer mon compte'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '70vh' }}>
      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                error={index === activeStep && error}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: index === activeStep ? 'bold' : 'normal',
                    color: index === activeStep ? '#e91e63' : 'inherit'
                  }
                }}
              >
                {label}
                {index === 1 && isAuthenticated && (
                  <Chip 
                    label="Connecté" 
                    size="small" 
                    color="success" 
                    sx={{ ml: 1 }}
                  />
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Messages d'erreur/succès */}
      {error && !error.includes('email') && !error.includes('nom') && 
       !error.includes('téléphone') && !error.includes('adresse') && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Contenu de l'étape actuelle */}
      {activeStep === 0 && renderCartStep()}
      {activeStep === 1 && renderAuthStep()}
      {activeStep === 2 && renderInfoStep()}
      {activeStep === 3 && !success && renderSummaryStep()}
      {activeStep === 3 && success && renderConfirmationStep()}

      {/* Actions */}
      {activeStep < 3 && !(activeStep === 3 && success) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="large"
          >
            Retour
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && cartItems.length === 0) ||
              (activeStep === 1 && !clientInfo.email) ||
              loading
            }
            size="large"
            sx={{ 
              px: 4,
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            {activeStep === 0 ? 'Continuer vers l\'authentification' : 
             activeStep === 1 ? 'Vérifier mon email' :
             activeStep === 2 ? 'Voir le récapitulatif' : 'Suivant'}
          </Button>
        </Box>
      )}

      {/* Bouton pour soumettre la commande (étape 3) */}
      {activeStep === 3 && !success && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            variant="outlined"
            size="large"
          >
            Retour aux informations
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmitOrder}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            {loading ? 'Traitement en cours...' : 'Confirmer et payer la commande'}
          </Button>
        </Box>
      )}

      {/* Modale d'authentification */}
      {renderAuthModal()}

      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;