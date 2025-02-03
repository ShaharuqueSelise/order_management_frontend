import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login,setUserEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async() => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }
    setError("");
    try {
        const response = await apiClient.post('/login', { email, password });
        setUserEmail(response?.data?.user?.email);
        login(response.data.token);
        navigate('/products');
      } catch (error) {
        alert('Login failed');
      }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 350, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
            Login
          </Typography>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" fontSize="14px" mt={1}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
