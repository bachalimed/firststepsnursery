// hooks/useFetchStudentPhoto.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const useFetchUserPhoto = (photoId) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (!photoId) return;

      try {
        const response = await axios.get(
          // `http://localhost:3500/hr/employees/employeeDocuments/${photoId}`,
          `https://firststepsnursery-api.onrender.com/hr/employees/employeeDocuments/${photoId}`,
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

    fetchUserPhoto();
  }, [photoId, token]);

  return { photoUrl, error };
};

export default useFetchUserPhoto;
