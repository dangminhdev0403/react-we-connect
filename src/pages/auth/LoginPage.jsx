import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress } from "@mui/material";
import { authSlice } from "@redux/slices/authSlice";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useLoginMutation } from "@services/rootApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { data, error, isError, isSuccess, isLoading }] =
    useLoginMutation();

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid"
      )
      .required(),
    password: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function onSubmit(formData) {
    login(formData);
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        openSnackbar({
          message: data?.message,
        })
      );

      const payload = {
        accessToken: data.data.access_token,
        user: { ...data.data.user },
      };
      dispatch(authSlice.actions.login(payload));
      navigate("/");
    }
    if (isError) {
      dispatch(
        openSnackbar({
          message: error?.data?.message,
          type: "error",
        })
      );
    }
  }, [isSuccess, data, dispatch, isError, error, navigate]);

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">Login</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Email"
          control={control}
          Component={TextInput}
          error={errors["email"]}
        />
        <FormField
          name="password"
          label="Password"
          control={control}
          type="password"
          Component={TextInput}
          error={errors["password"]}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      <p className="mt-4">
        New on our platform? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
