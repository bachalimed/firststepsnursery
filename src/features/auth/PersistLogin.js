//will keep us logged in every afetr refreshing the applicationimport React from 'react'
import { Outlet, Link ,useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
// import { useLayoutEffect } from "react";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import LoadingStateIcon from '../../Components/LoadingStateIcon'
import PublicHeader from '../../Components/Shared/Header/PublicHeader'
import PublicFooter from '../../Components/Shared/Footer/PublicFooter'
const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  // const navigate = useNavigate();
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
        //console.log('verifying refresh token')
        try {
          const response = await refresh();
          //console.log('Refresh result:', response);
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error('Refresh failed:', err);        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

 


  let content;
  if (!persist) {
    // persist: no
    //console.log('no persist in persist file')
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    //console.log('loading in persist file')
    content = <LoadingStateIcon/>
  } else if (isError) {
    //persist: yes, token: no
    //console.log('error in persist file')
    content = (
      <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow flex justify-center items-center text-center p-6">
        <p className="text-lg text-red-500">
          {`${error?.data?.message || "An unexpected error occurred"} - `}
          <Link to="/login/" className="text-blue-500 hover:underline">Login again</Link>.
        </p>
      </main>
      <PublicFooter />
    </div>
    
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
  //console.log('success persist & token in persist file')
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    //console.log('token and isUninitialized',isUninitialized)
    
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
