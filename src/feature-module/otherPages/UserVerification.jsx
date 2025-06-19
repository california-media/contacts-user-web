import React from 'react'
import { useLocation } from 'react-router';

const UserVerification = () => {
const location = useLocation();

const queryParams = new URLSearchParams(location.search);
const verificationToken = queryParams.get('verificationToken');
  return (
    <div>UserVerification token {verificationToken}</div>
  )
}

export default UserVerification