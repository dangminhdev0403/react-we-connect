import FormField from "@components/FormField";
import OTPInput from "@components/FormInputs/OTPInput";
import { Button, CircularProgress } from "@mui/material";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OTPVerifyPage = () => {
  const { control, handleSubmit } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (formData) => {
    setIsLoading(true);

    // Giả lập OTP đúng là "123456"
    setTimeout(() => {
      setIsLoading(false);
      if (formData.otp === "123456") {
        // dispatch(login({ email: location?.state?.email }));
        dispatch(
          openSnackbar({ type: "success", message: "Xác thực thành công!" })
        );
        navigate("/");
      } else {
        dispatch(
          openSnackbar({ type: "error", message: "Mã OTP không đúng!" })
        );
      }
    }, 1500);
  };

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">
        Two-Step Verification
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="otp"
          label="Type your 6 digit security code"
          control={control}
          Component={OTPInput}
        />
        <Button variant="contained" type="submit">
          {isLoading && <CircularProgress size="16px" className="mr-1" />}
          Verify my account
        </Button>
      </form>
      <p className="mt-4">
        Didn&apos;t get the code? <Link to="/login">Resend</Link>
      </p>
    </div>
  );
};

export default OTPVerifyPage;
