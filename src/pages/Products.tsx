import { useState, useEffect } from 'react';
import { 
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress
} from '@mui/material';
import apiClient from "../api/client";
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const loggedInUser = localStorage.getItem('user_email');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data?.products || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  console.log(products);

  const handleToggleStatus = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        await apiClient.put(`/editproduct/${id}`, { 
          name: product.name, 
          description: product.description,
          price: product.price,
          weight: product.weight,
          image: product.image,
          isEnabled: !product.isEnabled 
        });
        fetchProducts();
      }
    } catch (err) {
      setError('Failed to update product status');
    }
  };

  const handleEdit = (id: number) => {
    // Handle edit navigation
    console.log('Edit product', id);
  };

  const handleAddToCartClick = (product: any) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      // Calculate discount from backend
      const { data } = await apiClient.post('/create/order', {
          customerInfo: {
            name: loggedInUser || "Test",
            email: loggedInUser || "--",
            address: "456 Oak Street"
          },
          items: [
            {
              productId: selectedProduct.id,
              quantity
            }
          ]
      });

      const newItem: CartItem = {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity,
        discount: data.discount,
        total: (selectedProduct.price * quantity) - data.discount
      };

      setCart(prevCart => {
        const existingItem = prevCart.find(item => 
          item.productId === newItem.productId
        );
        
        if (existingItem) {
          return prevCart.map(item =>
            item.productId === newItem.productId
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        
        return [...prevCart, newItem];
      });

      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (loading) return <LinearProgress />;

  return (
    <div>
    <Grid container spacing={3} sx={{ p: 3 }}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor:'#29293D',color:'white' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
                <Chip 
                  label={product.isEnabled ? 'Enabled' : 'Disabled'} 
                  color={product.isEnabled ? 'success' : 'error'} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>

              <Typography variant="body2">
                Price: ${product.price.toFixed(2)}
              </Typography>

              <Typography variant="body2">
                Weight: {product.weight} kg
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton 
                onClick={() => handleToggleStatus(product.id)}
                aria-label="toggle status"
                size='large'
                color='error'
              >
                {product.isEnabled ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </IconButton>
              
              <IconButton 
                onClick={() => handleEdit(product.id)}
                aria-label="edit"
                size='medium'
                color='success'
              >
                <EditIcon />
              </IconButton>

              <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleAddToCartClick(product)}
                  disabled={!product.isEnabled}
                >
                  Add to Cart
                </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Quantity Selection Dialog */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add {selectedProduct?.name} to Cart</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </DialogActions>
      </Dialog>
  </div>
  );
}