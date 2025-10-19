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
    name: Yup.string().min(2, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
  });

  async function handleRegister(values, actions) {
    try {
      const { token, threadID, user } = await register(values.name, values.email, values.password);
      dispatch(setAuth({ token, threadID, user }));
      localStorage.setItem("auth", JSON.stringify({ token, threadID, user }));
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      actions.setSubmitting(false);
      actions.setFieldError("email", "Could not register. Try again.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900 font-amiamie-round">
      <div className="w-[24rem] p-6 rounded-xl">
        <h2 className="text-4xl backdrop-blur-md py-4 rounded-full font-semibold text-white text-center mb-10 font-amiamie">
          Register
        </h2>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2.5 text-xl rounded-3xl bg-red-200/30 text-red-50 placeholder-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 text-xl rounded-3xl bg-red-200/30 text-red-50 placeholder-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2.5 text-xl rounded-3xl bg-red-200/30 text-red-50 placeholder-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-fit px-4 m-auto py-2 mt-10 rounded-full border-blue-500 border hover:bg-blue-600 text-white font-semibold transition-all duration-300 shadow-md"
              >
                {isSubmitting ? "..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-lg text-center text-zinc-400 mt-10">
          Already have an account?{" "}
          <Link to="/login" className="text-red-300 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}