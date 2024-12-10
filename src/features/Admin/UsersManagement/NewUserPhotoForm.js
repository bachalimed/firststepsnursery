//this window will show on the user profile with the photo with a button to update

import { useState, useEffect } from "react";
import { useUpdateUserPhotoMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import { useParams } from "react-router-dom";

const NewUserPhotoForm = () => {
  //an add user function that can be called inside the component

  const [
    addNewUserPhoto,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useUpdateUserPhotoMutation(); //it will not execute the mutation nownow but when called
  const formData = new FormData();
  const Navigate = useNavigate();
  //initialisation of states for each input
  const { id } = useParams(); //pull the id from use params from the url, because it will be ending /userDetails/:id
  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    if (isSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setUserPhoto("");
      Navigate("/admin/usersManagement/users/"); //will navigate here after saving
    }
  }, [isSuccess, Navigate]); //even if no success it will navigate and not show any warning if failed or success

  //handlers to get the individual states from the input

  const onUserPhotoChanged = (e) => {
    setUserPhoto(e.target.files[0]);
  };
  const onSavePhotoClicked = async (e) => {
    e.preventDefault();

    if (userPhoto) {
      //if cansave is true
      formData.append("photo", userPhoto);
      await addNewUserPhoto({ userPhoto }); //we call the add new user mutation and set the arguments to be saved
      //added this to confirm save
      if (isError) {
        console.log("error savingg", error); //handle the error msg to be shown  in the logs??
      }
    }
  };
  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>{" "}
      {/*will display if there is an error message, some of the error messagees are defined in the back end responses*/}
      <form className="form" onSubmit={onSavePhotoClicked}>
        <label className="form__label" htmlFor="location">
          Photo : <span className="nowrap"></span>
        </label>
        <input
          className=""
          id="userPhoto"
          name="userPhoto"
          type="file"
          accept=".png, .jpg, .jpeg"
          autoComplete="off"
          // value={userPhoto} because it is a file
          onChange={onUserPhotoChanged}
        />
        {/* will show only if status is loading */}
        {isLoading === "loading" && <p>Submitting...</p>}

        <div className="flex justify-end items-center space-x-4">
          <button
            className=" px-4 py-2 bg-green-600 text-white rounded"
            type="submit"
            title="Save"
            onClick={onSavePhotoClicked}
            hidden={!userPhoto}
          >
            Upload Photo
          </button>
        </div>
      </form>
    </>
  );
  return content;
};
export default NewUserPhotoForm;
