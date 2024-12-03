import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoadingStateIcon from "../../Components/LoadingStateIcon";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { PiEyeClosedThin,PiEyeLight  } from "react-icons/pi";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const userRef = useRef(); //to set the focus on user input
  const errRef = useRef(); //to set the focus if there is an error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation(); //we will only need the isLoading state from this mutation

  useEffect(() => {
    userRef.current.focus(); //will put the focus on the user field on load of page
  }, []);

  useEffect(() => {
    //clears out the serrormessage when username or password changes
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    
  });
  const togglePasswordVisibility = () =>
    setPasswordVisibility((prevVisibility) => !prevVisibility);

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <LoadingStateIcon />;

  const content = (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">User Login</h1>

        <p
          ref={errRef}
          className={`${errClass} text-red-500 text-center mb-4`}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>
            <div className="flex items-center">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type={passwordVisibility ? "password" : "text"}
              id="password"
              onChange={handlePwdInput}
              value={password}
              required
            />
             <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3"
                aria-label="Toggle Password Visibility"
              >
                {passwordVisibility ? (
                  < PiEyeClosedThin className="text-gray-500" />
                ) : (
                  < PiEyeLight className="text-gray-500" />
                )}
              </button>
          </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="persist"
              className="inline-flex items-center text-sm text-gray-600"
            >
              <input
                type="checkbox"
                className="form-checkbox text-indigo-600 h-4 w-4"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              <span className="ml-2">Keep Me Signed In</span>
            </label>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <footer className="text-gray-500">
        <Link to="/" className="hover:text-blue-500">
          Back to Home
        </Link>
      </footer>
    </section>
  );
  return content;
};
export default Login;
