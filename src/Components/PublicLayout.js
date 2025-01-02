import React from 'react'
import { Outlet } from 'react-router'
// import PublicHeader from './PublicHeader'
// import PublicFooter from './PublicFooter'
import CookieConsentBanner from "./CookieConsentBanner";

const PublicLayout = () => {
  return (
   
   <>
    <CookieConsentBanner />
    <Outlet/>
    </>
  )
}

export default PublicLayout