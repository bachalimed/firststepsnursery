import React from "react";
import PublicHeader from "./Shared/Header/PublicHeader";
import PublicFooter from "./Shared/Footer/PublicFooter";
const CookiePolicy = () => {
  return (
    <>
      <PublicHeader />
      <div className="bg-gray-100 min-h-screen py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Cookie Policy
          </h1>
          <p className="text-gray-700 mb-4">
            This page explains how we use cookies on our website. We aim to be
            transparent about what cookies we use and why.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            What are cookies?
          </h2>
          <p className="text-gray-700 mb-4">
            Cookies are small text files that are placed on your device when you
            visit a website. They are widely used to make websites work more
            efficiently and provide information to website owners.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            How we use cookies
          </h2>
          <p className="text-gray-700 mb-4">
            We only use cookies necessary to keep you signed into your account
            securely. These cookies store a refresh token, which helps us
            maintain your login session. Without these cookies, you would have
            to log in every time you visit the site.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            Types of cookies we use
          </h2>
          <p className="text-gray-700 mb-4">
            We use only the following type of cookie:
          </p>
          <table className="table-auto w-full border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Cookie Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Purpose
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Expiry
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  refresh_token
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Maintains your login session by securely storing the refresh
                  token.
                </td>
                <td className="border border-gray-300 px-4 py-2">7 days</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            Managing cookies
          </h2>
          <p className="text-gray-700 mb-4">
            You can control and manage cookies through your browser settings.
            Most browsers allow you to:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>View the cookies stored on your device</li>
            <li>Block cookies from specific sites</li>
            <li>Delete cookies when you close your browser</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Please note that blocking or deleting cookies may impact your
            ability to use this site.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            Changes to this policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this policy from time to time to reflect changes in
            our practices or legal requirements. Please check this page
            regularly for updates.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            Contact us
          </h2>
          <p className="text-gray-700">
            If you have any questions about how we use cookies, please contact
            us:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Email:</strong> firststepsnursery@outlook.com
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> 77 Rue Hedi Chaker, Dar Chaabane El Fehri,
            8011, Nabeul, Tunisia
          </p>
        </div>
      </div>
      <PublicFooter />
    </>
  );
};

export default CookiePolicy;
