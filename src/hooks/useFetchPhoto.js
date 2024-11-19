// hooks/useFetchStudentPhoto.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const useFetchPhoto = (photoId) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchPhoto = async () => {
      if (!photoId) return;

      try {
        console.log("Fetching photo with ID:", photoId);
        const response = await axios.get(
          `http://localhost:3500/students/studentsParents/studentDocuments/${photoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        console.log("Fetched photo URL:", url); 
        setPhotoUrl(url);
      } catch (error) {
        console.error("Error fetching student photo:", error);
        setError(error);
      }
    };

    fetchPhoto();
  }, [photoId, token]);

  return { photoUrl, error };///this is how to retrienve the photo: deconstruct into {photUrl}=useFethcPhoto
};

export default useFetchPhoto;
