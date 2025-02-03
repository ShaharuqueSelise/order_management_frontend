import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { CartItem } from './Products';

const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    return (
        <div>
            {/* Cart Preview Sidebar */}
            <div style={{
                position: 'fixed',
                right: 0,
                top: 0,
                width: '300px',
                height: '100vh',
                backgroundColor: 'white',
                boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                padding: '20px',
                overflowY: 'auto'
            }}>
                <Typography variant="h6" gutterBottom>
                    Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                </Typography>

                {cart.map(item => (
                    <div key={item.productId} style={{ marginBottom: '1rem' }}>
                        <Typography variant="body1">
                            {item.name} x {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ${item.price} each | Discount: ${item.discount}
                        </Typography>
                    </div>
                ))}

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Total: ${cart.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                </Typography>
            </div>
        </div>
    );
};

export default Cart;