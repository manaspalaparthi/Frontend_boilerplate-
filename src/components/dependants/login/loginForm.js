import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import { LoginContext } from 'contexts';
import { DeveloperConfig } from 'constants/index';


export const LoginForm = (props) => {
  const { devMode, setAccessToken } = useContext(LoginContext);

  const formik = useFormik({
    initialValues:
    {
      emailId: '',
      password: '',
    },
    validationSchema: () => {
      if (devMode) return Yup.object().shape({
        emailId: Yup.string().email('Must be a valid Email').max(255),
        password: Yup
          .string()
          .max(255)
      });
      return Yup.object().shape({
        emailId: Yup.string().email('Must be a valid Email').max(255)
          .required('Email is required'),
        password: Yup
          .string()
          .max(255)
          .required('Password is required')
      });
    },
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      const response = await props.login(values);
      if (response.success) {
        setAccessToken(response.accessToken);
        setStatus({ success: true });
        setSubmitting(false);
      } else {
        setStatus({ success: false });
        setErrors({ submit: response.data });
        setSubmitting(false);
      }
    },
  });

  let form = (
    <form noValidate onSubmit={formik.handleSubmit}>
      <TextField
        autoFocus
        error={formik.touched.emailId && Boolean(formik.errors.emailId)}
        fullWidth
        helperText={formik.touched.emailId && formik.errors.emailId}
        label="Email Address"
        margin="normal"
        name="emailId"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={devMode ? DeveloperConfig.devDetails.user : formik.values.emailId}
        variant="outlined"
      />
      <TextField
        error={formik.touched.password && Boolean(formik.errors.password)}
        fullWidth
        helperText={formik.touched.password && formik.errors.password}
        label="Password"
        margin="normal"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={devMode ? DeveloperConfig.devDetails.password : formik.values.password}
        variant="outlined"
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Log In
        </Button>
      </Box>
    </form>

  );
  return form;
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};