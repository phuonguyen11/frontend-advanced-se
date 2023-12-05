import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";
import google from "../../images/google.svg";
// context
import { useUserDispatch, loginUser } from "../../context/UserContext";
import { registerUserAPI, getUni } from "../../api";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState(""); //full name
  var [loginValue, setLoginValue] = useState(""); // email address
  var [passwordValue, setPasswordValue] = useState("");
  var [userRole, setUserRole] = useState(null);
  var [userUni, setUserUni] = useState(null);
  var [uniList, setUniList] = useState([]);
  var [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    const getUniList = async () => {
      try {
        const uniData = await getUni();
        // console.log(`uniData`, uniData);
        setUniList(uniData);
      } catch (err) {
        console.log(err);
      }
    };
    getUniList();
    // console.log(`uniList`, uniList);
  }, []);
  const submitHandler = async () => {
    setError(false);
    setIsLoading(true);
    try {
      await registerUserAPI({
        email: loginValue,
        password: passwordValue,
        name: nameValue,
        role: userRole,
        uni_id: userUni,
      });
      setError(null);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      console.log(err);
      setError(true);
      setIsLoading(false);
    }
  };
  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>ABC TEAM</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            <Tab label="New User" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Good Morning, User
              </Typography>
              <Button size="large" className={classes.googleButton}>
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                >
                  Forget Password
                </Button>
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="email"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <FormControl
                fullWidth
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
              >
                <InputLabel id="role-label">Your role</InputLabel>
                <Select
                  labelId="role"
                  id="demo-simple-select"
                  value={userRole}
                  label="Your role"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setUserRole(e.target.value);
                  }}
                  sx={{
                    color: "#F5B000",
                    fontSize: "36px",
                    "&:hover": {
                      color: "#FFD700",
                    },
                  }}
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                >
                  <MenuItem value="0">Student</MenuItem>
                  <MenuItem value="1">Community Leader</MenuItem>
                  <MenuItem value="2">University Administration Staff</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
              >
                <InputLabel id="university-label">Your university</InputLabel>
                <Select
                  labelId="userversity"
                  id="university"
                  value={userUni}
                  label="Your university"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setUserUni(e.target.value);
                  }}
                >
                  {uniList.map((uni) => (
                    <MenuItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <React.Fragment>
                    <Button
                      onClick={submitHandler}
                      // onClick={() =>
                      //   loginUser(
                      //     userDispatch,
                      //     loginValue,
                      //     passwordValue,
                      //     props.history,
                      //     setIsLoading,
                      //     setError,
                      //   )
                      // }
                      disabled={
                        !loginValue ||
                        !passwordValue ||
                        !nameValue ||
                        !userRole ||
                        !userUni
                      }
                      size="large"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className={classes.createAccountButton}
                    >
                      Create your account
                    </Button>

                    {isSuccess && (
                      <div>
                        <Typography variant="subtitle2" align="center">
                          Register successfully!
                        </Typography>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
              {/* <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div>
              <Button
                size="large"
                className={classnames(
                  classes.googleButton,
                  classes.googleButtonCreating,
                )}
              >
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button> */}
            </React.Fragment>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2023 ABC TEAM. All rights reserved.
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
