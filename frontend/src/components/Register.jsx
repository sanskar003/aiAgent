import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setAuth } from "../slices/authSlice.js";
import { register } from "../api/chat.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Too short").required("Password is required"),
  });

  async function handleRegister(values, actions) {
    try {
      localStorage.clear();

      const { token, user, threadID } = await register(
        values.name,
        values.email,
        values.password
      );

      dispatch(setAuth({ token, user }));
      localStorage.setItem("auth", JSON.stringify({ token, user }));
      if (threadID) {
        localStorage.setItem("activeThreadId", threadID);
      }
      
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);

      const msg = err.message?.toLowerCase() || "";
      let errorText = "Registration failed. Please try again.";

      if (msg.includes("already") || msg.includes("exists")) {
        errorText = "An account with this email already exists.";
      } else if (msg.includes("invalid")) {
        errorText = "Please enter valid details.";
      } else if (msg.includes("network")) {
        errorText = "Unable to connect. Check your internet connection.";
      }

      actions.setStatus(errorText);
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative font-amiamie-round overflow-hidden px-4 sm:px-6">
      {/* Background gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-zinc-900 to-black animate-gradient-x" />

      {/* Glassmorphic Card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-sm px-6 sm:px-8 py-8 sm:py-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/10 shadow-lg z-10 mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-white text-center font-semibold mb-6 font-amiamie-round">
          Create Account
        </h2>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, status }) => (
            <Form className="flex flex-col gap-5">
              {status && (
                <div className="text-red-400 text-center text-sm -mt-2">
                  {status}
                </div>
              )}

              {/* Name */}
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2 sm:py-2.5 text-base sm:text-lg rounded-xl bg-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-red-500 focus:to-purple-500 transition"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Your email"
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
                  name="password"
                  type="password"
                  placeholder="Choose a password"
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
                    className="w-full h-full rounded-xl bg-gradient-to-r from-red-500 to-zinc-600 text-white font-medium shadow-md cursor-pointer transition-transform duration-300"
                  >
                    Register
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="text-sm sm:text-md text-center text-zinc-400 mt-8 font-amiamie">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-300 hover:text-purple-400 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
