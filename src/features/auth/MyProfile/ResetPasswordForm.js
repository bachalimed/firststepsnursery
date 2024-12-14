import { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../Admin/UsersManagement/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import MyProfile from "../MyProfile";

import { PiEyeClosedThin, PiEyeLight } from "react-icons/pi";

import { PWD_REGEX } from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";

import { useOutletContext } from "react-router-dom";

const ResetPasswordForm = ({ user }) => {
  //user was passed as prop in editUser
  const navigate = useNavigate();

  //initialise the mutation to be used later
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  //initialise the parameters with the user details
  // Consolidated form state
  const [formData, setFormData] = useState({
    id: user.id,
    userName: user?.userName,
    oldPassword: "",
    newPassword1: "",
    newPassword2: "",
    criteria: "resetPassword",
  });
  const [validity, setValidity] = useState({
    validOldPassword: false,
    validNewPassword1: false,
    validNewPassword2: false,
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword1: false,
    newPassword2: false,
  });
  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validOldPassword: PWD_REGEX.test(formData.oldPassword),
      validNewPassword1: PWD_REGEX.test(formData.newPassword1),
      validNewPassword2: formData.newPassword1 === formData.newPassword2,
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        id: "",
        oldPassword: "",
        newPassword1: "",
        newPassword2: "",
        criteria: "",
      });
      triggerBanner("Password updated successfully.", "success");
      navigate(`/myProfile/myDetails/${user?.id}/`);
    }
  }, [isSuccess, navigate, triggerBanner]);

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave = Object.values(validity).every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await updateUser({ formData });
      console.log(response, "response");
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");
      } else if (
        response?.error &&
        response?.error?.data &&
        response?.error?.data?.message
      ) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update user. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    navigate(`/myProfile/myDetails/${user?.id}/`);
  };
  console.log(formData, "formData");

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const content = (
    <>
      <MyProfile />
      <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Update Password
        </h2>
        <form onSubmit={onSaveUserClicked} className="space-y-4">
          {[
            {
              label: "Old Password",
              name: "oldPassword",
              value: formData.oldPassword,
              valid: validity.validOldPassword,
              placeholder: "Enter old password",
              errorMessage: "Invalid old password format.",
            },
            {
              label: "New Password",
              name: "newPassword1",
              value: formData.newPassword1,
              valid: validity.validNewPassword1,
              placeholder: "Enter new password",
              errorMessage: "Invalid new password format.",
            },
            {
              label: "Confirm Password",
              name: "newPassword2",
              value: formData.newPassword2,
              valid: validity.validNewPassword2,
              placeholder: "Re-enter new password",
              errorMessage: "Passwords do not match.",
            },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-600">
                {field.label}
                <div className="relative">
                  <input
                    type={passwordVisibility[field.name] ? "text" : "password"}
                    name={field.name}
                    value={field.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <button
                    aria-label="toggle password visiblity"
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600 focus:outline-none"
                  >
                    {passwordVisibility[field.name] ? (
                      <PiEyeLight />
                    ) : (
                      <PiEyeClosedThin />
                    )}
                  </button>
                </div>{" "}
              </label>
              {!field.valid && field.value !== "" && (
                <p className="text-xs text-red-600 mt-1">
                  {field.errorMessage}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-between items-center">
            <button
              aria-label="cancel update password"
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              aria-label="submit updates password"
              type="submit"
              className="save-button"
              disabled={!canSave || isLoading}
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save Changes?"
      />
    </>
  );

  return content;
};
export default ResetPasswordForm;
