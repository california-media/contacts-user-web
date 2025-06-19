import React from 'react'
import { useSearchParams } from 'react-router-dom';

const UserVerification = () => {
const [searchParams] = useSearchParams();
const verificationToken = searchParams.get('verificationToken');
  return (
    <div>UserVerification token {verificationToken}</div>
  )
}

export default UserVerification