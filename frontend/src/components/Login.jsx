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
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
  });

  async function handleLogin(values, actions) {
    try {
      const { token, threadID, user } = await login(values.email, values.password);
      dispatch(setAuth({ token, threadID, user }));
      localStorage.setItem("auth", JSON.stringify({ token, threadID, user }));
      navigate("/"); // ✅ redirect after login
    } catch (err) {
      console.error("Login failed:", err);
      actions.setSubmitting(false);
      actions.setFieldError("email", "Invalid credentials or server error.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900 font-amiamie-round ">
      <div className="w-[24rem] p-6 rounded-xl ">
        <h2 className="text-4xl backdrop-blur-md py-4 rounded-full font-semibold text-white text-center mb-15 font-amiamie">
          Sign In
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 text-xl rounded-3xl bg-red-200/30 text-red-50 placeholder-white  focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-sm mt-1 "
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2.5 text-xl rounded-3xl bg-red-200/30 text-red-50 placeholder-white  focus:outline-none focus:ring-2 focus:ring-red-400 transition"
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
                className="w-fit px-4 m-auto py-2 mt-10 rounded-full  border-blue-500 border hover:bg-blue-600 text-white font-semibold transition-all duration-300 shadow-md"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-lg text-center text-zinc-400 mt-10">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-red-300  hover:text-blue-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
