import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button } from "@mui/material";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useRegisterMutation } from "@services/rootApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const RegisterPage = () => {
  const navigate = useNavigate(); // ✅ Gọi hook ở trên cùng
  const dispath = useDispatch();
  const [register, { data, isLoading, error, isError, isSuccess }] =
    useRegisterMutation();
  console.log("data", { data, isLoading, error });

  const formSchema = yup.object().shape({
    fullName: yup.string().required(),
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

  const onSubmit = (formData) => {
    console.log("Mock đăng ký:", formData);
    const dataRegister = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
    };
    register(dataRegister);
  };

  useEffect(() => {
    if (isSuccess) {
      dispath(openSnackbar({ message: data?.message }));
      navigate("/login");
    }
  }, [isSuccess, data, dispath, navigate]);

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">Register</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="fullName"
          label="Full Name"
          control={control}
          Component={TextInput}
          error={errors["fullName"]}
        />
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
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign Up"
          )}
        </Button>

        {isError && (
          <Alert severity="error" className="mt-4">
            {error?.data?.message || "Something went wrong"}
          </Alert>
        )}
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login">Sign in instead</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
