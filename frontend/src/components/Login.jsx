import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from "../slices/authSlice.js";
import { login } from "../api/chat.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Too short").required("Password is required"),
  });

  async function handleLogin(values, actions) {
    try {
      const { token, user } = await login(values.email, values.password);
      dispatch(setAuth({ token, user }));
      localStorage.setItem("auth", JSON.stringify({ token, user }));
      navigate("/");
      
    } catch (err) {
      actions.setSubmitting(false);
      const msg = err.message?.toLowerCase() || "";
      let errorText = "Login failed. Please try again.";

      if (msg.includes("invalid") || msg.includes("unauthorized")) {
        errorText = "Incorrect email or password.";
      } else if (msg.includes("not found")) {
        errorText = "No account found with this email.";
      } else if (msg.includes("disabled") || msg.includes("forbidden")) {
        errorText = "Your account has been disabled. Contact support.";
      } else if (msg.includes("network")) {
        errorText = "Unable to connect. Check your internet connection.";
      }

      actions.setFieldError("email", errorText);
      actions.setStatus(errorText);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative font-amiamie-round overflow-hidden px-4 sm:px-6">
      {/* Background gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-zinc-900 to-black animate-gradient-x" />

      {/* Glassmorphic Card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-sm px-6 sm:px-8 py-8 sm:py-10 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg z-10 mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-white text-center font-semibold mb-6 font-amiamie-round">
          Welcome
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, status }) => (
            <Form className="flex flex-col gap-5">
              {status && (
                <div className="text-red-400 text-center text-sm -mt-2">
                  {status}
                </div>
              )}

              {/* Email */}
              <div>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 sm:py-2.5 text-base sm:text-lg rounded-xl bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-red-500 focus:to-purple-500 transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 sm:py-2.5 text-base sm:text-lg rounded-xl bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-red-500 focus:to-purple-500 transition"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Submit */}
               <div className="mt-4 h-12 flex items-center justify-center">
                {isSubmitting ? (
                  <video
                    src="/gif/authLoader.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    className="w-18 h-18 rounded-full object-contain"
                  />
                ) : (
                  <button
                    type="submit"
                    className="w-full h-full rounded-xl bg-gradient-to-r from-red-500 to-zinc-600 text-white font-medium shadow-md cursor-pointer  transition-transform duration-300"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="text-sm sm:text-md text-center text-zinc-400 mt-8 font-amiamie">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-red-400 hover:text-purple-400 transition"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}