import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const UserVerification = () => {
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('verificationToken');

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (verificationToken) {
          const response = await axios.post(
            'https://100rjobf76.execute-api.eu-north-1.amazonaws.com/user/signup',
             {verifyToken: verificationToken }
          );

          console.log("Signup successful:", response.data);
        }
      } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);

      }
    };

    verifyUser();
  }, [verificationToken]);

  return (
    <div>Thanks for confirmation</div>
  );
};

export default UserVerification;
