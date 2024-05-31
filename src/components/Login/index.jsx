import React, { useState, useEffect, useRef, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import "../style/style.css";
import carserviceimage from "../../images/Car-service_01.gif";

const defaultTheme = createTheme();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(180); // Initialize timer to 180 seconds (3 minutes)
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [timerExpired, setTimerExpired] = useState(false); // State to track if timer has expired
  const intervalRef = useRef(); // Ref to store the interval ID

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Remove any non-numeric characters
    setOtp(value);
    // Enable the Verify button only if the value is exactly 5 digits
    setIsVerifyButtonDisabled(value.length !== 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

    if (otpRequired) {
      handleOtpVerification();
    } else {
      try {
        const response = await fetch(
          "https://feedback-n4uc.onrender.com/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }), // Include email and password in the request body
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          if (responseData.status) {
            setOtpRequired(true); // Proceed to OTP verification
          } else {
            setError("Login failed: " + responseData.message);
            setIsShaking(true);
            setTimeout(() => {
              setIsShaking(false);
            }, 300);
          }
        } else {
          setError(responseData.message);
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
          }, 300);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 300);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    }
  };

  const handleOtpVerification = async () => {
    try {
      const response = await fetch(
        "https://feedback-n4uc.onrender.com/otpVerification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }), // Include email and otp in the request body
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.status) {
        // Save the token (e.g., to localStorage)
        const token = responseData.data.token;
        localStorage.setItem("authToken", token);
        window.location.href = "/admin/servicefeedback";
        console.log("Login successful:", responseData.message);
      } else {
        setError("OTP verification failed: " + responseData.message);
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 300);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 300);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleResendOtp = async () => {
    setLoading(true); // Show loading indicator
    setTimerExpired(false); // Reset timer expired state

    try {
      const response = await fetch(
        "https://feedback-n4uc.onrender.com/resendOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Include email in the request body
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.status) {
        console.log("OTP resent:", responseData.message);
        setTimer(180); // Reset the timer to 3 minutes
        startTimer(); // Restart the timer
      } else {
        setError(responseData.message);
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 300);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 300);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const startTimer = useCallback(() => {
    setTimer(180); // Reset the timer to 3 minutes
    setTimerExpired(false); // Reset timer expired state
    intervalRef.current = setInterval(handleCountdown, 1000);
  }, []); // Use an empty dependency array to ensure this function is stable

  const handleCountdown = () => {
    setTimer((prevTimer) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else {
        clearInterval(intervalRef.current);
        setTimerExpired(true); // Set timer expired state
        console.log("Timer reached 0");
        return 0; // Ensure timer does not go below 0
      }
    });
  };

  useEffect(() => {
    if (otpRequired) {
      startTimer(); // Start the timer when OTP is required
      return () => clearInterval(intervalRef.current); // Clean up on component unmount or otpRequired change
    }
  }, [otpRequired, startTimer]);

  // Function to format the timer for display
  const formattedTimer = `${String(Math.floor(timer / 60)).padStart(
    2,
    "0"
  )}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ flexGrow: 1 }}></Box>

      <Grid container component="main" sx={{ height: "calc(100vh - 64px)" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={6}
          md={7}
          sx={{
            backgroundImage: `url(${carserviceimage})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "light",
            backgroundPosition: "center",
            height: "500px",
            width: "400px",
            marginTop: "100px",
            backgroundSize: "contain",
          }}
        />
        <Grid item xs={12} sm={8} md={5}>
          <Box
            sx={{
              height: "500px",
              width: "400px",
              my: 12,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "100px",
              padding: "50px",
              boxShadow: "1px 2px 7px rgba(0.3, 0.3, 0.3, 0.3)",
              borderRadius: "20px",
              animation: isShaking ? "shake 0.5s" : "",
            }}
          >
            <img
              src="https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/logo.png"
              alt="Logo"
              height="400"
              width="150"
              style={{ marginRight: "16px", marginTop: "-20px" }}
            />
            <Avatar sx={{ m: 1, backgroundColor: "#3452c7" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
              Sign in
            </Typography>
            {error && <p className="text-danger">{error}</p>}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {!otpRequired && ( // Render email and password inputs if OTP is not required
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={toggleShowPassword}
                          aria-label={
                            showPassword ? "Hide Password" : "Show Password"
                          }
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                </>
              )}
              {otpRequired && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoComplete="off"
                  autoFocus
                  value={otp}
                  onChange={handleOtpChange}
                  inputProps={{
                    maxLength: 5, // Enforce max length at the input level
                    inputMode: "numeric", // Display numeric keyboard on mobile
                    pattern: "[0-9]*", // Ensure only numeric input
                  }}
                />
              )}
              {otpRequired && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="body1" color="textSecondary">
                    Remaining Time: {formattedTimer}
                  </Typography>
                  {timerExpired && (
                    <Button
                      variant="text"
                      onClick={handleResendOtp}
                      sx={{ ml: 2 }}
                    >
                      Resend OTP
                    </Button>
                  )}
                </Box>
              )}

             
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                sx={{
                  display: otpRequired ? "none" : "block", // Hide if OTP input is required
                }}
              />
              {loading ? ( // Show loading indicator if loading state is true
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : otpRequired ? ( // Render Verify button if OTP is required and not loading
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isVerifyButtonDisabled} // Disable button if OTP is not entered
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#3452c7",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }}
                >
                  Verify
                </Button>
              ) : (
                // Render Login In button if OTP is not required and not loading
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#3452c7",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }}
                >
                  Login In
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
