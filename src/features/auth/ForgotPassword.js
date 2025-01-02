import {  useState, useEffect } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import ConfirmationModal from "../../Components/Shared/Modals/ConfirmationModal";
import { useLoginMutation } from "./authApiSlice";
import PublicHeader from "../../Components/Shared/Header/PublicHeader";
import PublicFooter from "../../Components/Shared/Footer/PublicFooter";
import { USER_REGEX } from "../../config/REGEX";

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Forgot Password";
  });

  const [username, setUsername] = useState("");
  //const { triggerBanner } = useOutletContext(); // Access banner trigger

  const [
    updateUser,
    {
      // isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useLoginMutation();
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const [validUsername, setValidUsername] = useState(false);
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setUsername("");
      navigate("/");
    }
  }, [isUpdateSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validUsername) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async (e) => {
    setShowConfirmation(false);
    try {
      const response = await updateUser({
        username: username,
        criteria: "forgotPassword",
      }).unwrap();
      if (response?.message) {
        // Success response
        alert(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        alert(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        alert(response?.error?.data?.message, "error");
      } else if (isUpdateError) {
        // In case of unexpected response format
        alert(updateError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        alert("Unexpected response from server.", "error");
      }
    } catch (error) {
      alert(error?.data?.message, "error");
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  const content = (
    <>
      <PublicHeader />
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Reset Password
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                aria-label="username"
                htmlFor="username"
                className="formInputLabel"
              >
                Username:{" "}
                {!validUsername && <span className="text-red-600 ">*</span>}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
            </div>

            <span className="text-red-600">
              Please submit your username, we will contact you with new
              credentials
            </span>

            <div className="flex items-center justify-between mt-6">
              <button className="save-button w-full" type="submit">
                Submit
              </button>
            </div>
          </form>
          {/* Confirmation Modal */}
          <ConfirmationModal
            show={showConfirmation}
            onClose={handleCloseModal}
            onConfirm={handleConfirmSave}
            title="Confirm Save"
            message="Are you sure you want to save Changes?"
          />
        </div>

        <footer className="text-gray-500">
          <Link to="/" className="hover:text-sky-700">
            <button className="cancel-button">Back to Home</button>
          </Link>
        </footer>
      </section>
      <PublicFooter />
    </>
  );
  return content;
};
export default ForgotPassword;
