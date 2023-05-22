/***
 *  Created by Sanchit Dang
 ***/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TextField, Paper, withStyles, Typography, Button, Box, Grid } from '@material-ui/core';
import { LoginContext } from 'contexts';
import { notify } from 'components';
import { DevModeConfig } from 'configurations';
import { API, TextHelper } from 'helpers';



const classes = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.dark,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  loginBox: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(10)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttons: {
    marginTop: theme.spacing(1)
  },
  developMessage: {
    position: 'absolute',
    bottom: '2vh'
  }
});

class LoginOld extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classes: {},
      pageHeading: "Login",
      emailId: "",
      password: ""
    };
  }

  performLogin() {
    if (DevModeConfig.bypassBackend) {
      this.context.setAccessToken('dummyToken');
    } else {
      let details = {
        username: (this.context.devMode ? (DevModeConfig.devDetails !== undefined ? DevModeConfig.devDetails.user : '') : this.state.emailId),
        password: (this.context.devMode ? (DevModeConfig.devDetails !== undefined ? DevModeConfig.devDetails.password : '') : this.state.password)
      };
      let apiResponse = API.login(details);
      if (apiResponse.success) {
        this.context.setAccessToken(apiResponse.data);
      }
    }
  }

  validationCheck() {
    if (this.context.devMode) {
      return this.performLogin();
    }
    if (!this.context.loginStatus) {
      const emailValidationResult = TextHelper.validateEmail(this.state.emailId);
      if (emailValidationResult && this.state.password) {
        this.performLogin();
        return true;
      } else if (this.state.emailId === "" && this.state.password === "") {
        notify('Email and password must not be empty!');
        return false;
      } else if (this.state.emailId) {
        notify('Email must not be empty!');
        return false;
      } else if (!emailValidationResult && this.state.emailId.length > 0) {
        notify('Invalid email!');
        return false;
      } else if (!this.state.password) {
        notify('Password must not be empty!');
        return false;
      }
    }
  }

  setEmailId(email) {
    this.setState({ emailId: email });
  }

  setPassword(password) {
    this.setState({ password: password });
  }

  componentDidMount() {
    this.setState({
      classes: this.props.classes
    });
    console.log("Component Mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.emailId !== this.state.emailId) {
      console.log("email changed", this.state.emailId);
    }
    if (prevState.password !== this.state.password) {
      console.log("password changed", this.state.password);
    }
  }

  render() {
    return <div>
      <Grid container spacing={0} justify="center">
        <Grid className={this.state.classes.loginBox} item xs={10} sm={6} md={4} lg={3} xl={2}>
          <Paper className={this.state.classes.paper}>
            <Typography component="h1" variant="h5">
              {this.state.pageHeading}
            </Typography>
            <form noValidate>
              <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" onChange={e => this.setEmailId(e.target.value)} autoFocus />
              <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" onChange={e => this.setPassword(e.target.value)} autoComplete="current-password" />
              <Button fullWidth variant="contained" color="primary" className={this.state.classes.buttons} onClick={this.validationCheck}>Login</Button>
              <Button fullWidth variant="contained" color="primary" className={this.state.classes.buttons} component={Link} to='/register'>Sign Up</Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} className={this.state.classes.developMessage}>
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              Developed by Deakin Launchpad
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div >;
  }
}
LoginOld.contextType = LoginContext;
LoginOld.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledLogin = withStyles(classes)(LoginOld);
export default StyledLogin;