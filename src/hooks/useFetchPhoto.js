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
        setPhotoUrl(url);
      } catch (error) {
        console.error("Error fetching student photo:", error);
        setError(error);
      }
    };

    fetchPhoto();
  }, [photoId, token]);

  return { photoUrl, error };
};

export default useFetchPhoto;
