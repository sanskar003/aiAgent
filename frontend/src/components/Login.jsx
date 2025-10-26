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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 font-amiamie-round p-3 sm:p-3 md:p-0 lg:p-0">
      <div className="w-[24rem] px-8 py-10 rounded-2xl backdrop-blur-xl bg-white/5 border border-zinc-700 shadow-red-500 shadow-lg/20">
        <h2 className="text-4xl text-white text-center font-semibold mb-6 font-amiamie">
          Sign In
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

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 text-lg rounded-xl bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2.5 text-lg rounded-xl bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 mt-4 rounded-xl border border-red-400 hover:bg-red-400 transition-all duration-300 text-white hover:text-black font-semibold  shadow-md"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-md text-center text-zinc-400 mt-8">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-300 hover:text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}