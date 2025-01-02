//will keep us logged in every afetr refreshing the applicationimport React from 'react'
import { Outlet, Link ,useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useLayoutEffect } from "react";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import LoadingStateIcon from '../../Components/LoadingStateIcon'
const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const [trueSuccess, setTrueSuccess] = useState(false);
  
  const [
    refresh,
    {
      isUninitialized, //refresh function not called yet
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode, first condition is because it runs two times first mount and then again, but we want to send the refresh token once at the second run

      const verifyRefreshToken = async () => {
        console.log('verifying refresh token')
        try {
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);


//added this to automatically redirect to home not working apparently
  useEffect(() => {
    if (isError) {
      // Automatically redirect to the login page on error
      navigate("/login/");
    }
  }, [isError, navigate]);

  let content;
  if (!persist) {
    // persist: no
    console.log('no persist in persist file')
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    console.log('loading in persist file')
    content = <><LoadingStateIcon/></>
  } else if (isError) {
    //persist: yes, token: no
    console.log('error in persist file')
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login/">Login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
  console.log('success persist & token in persist file')
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log('token and isUninitialized',isUninitialized)
    
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
