import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { BsYoutube } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reset, signIn } from "../../redux/auth/authSlice";
import Loader from "../../Components/Loader";
import logo from '../../assets/images/logo.png';


const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (user) {
      navigate("/");
  }
  

    dispatch(reset());
  }, [dispatch, isError, message, navigate, user]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!email || !password) {
  //     toast.error("Please fill all the fields.");
  //   } else {
  //     try {
  //       const userData = {
  //         email,
  //         password,
  //       };
  //       dispatch(signIn(userData));
  //       toast.info("Process is successful.");
  //       setTimeout(() => {
  //         navigate("/");
  //       }, 3000);
  //     } catch (error) {
  //       toast.error("Error! Check your information.");
  //     }
  //   }
  // };


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
        toast.error("Please fill all the fields.");
        return; // Exit early if fields are missing
    }

    try {
        const response = await dispatch(signIn({ email, password })).unwrap(); // Unwrap to get the payload or throw an error

        // Check if response contains the access token
        if (response && response.access_token) {
            // Save the access token in local storage
            localStorage.setItem("token", response.access_token);

            toast.info("Login successful.");
            
            // Navigate to the home page
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } else {
            toast.error("Error! Check your information.");
        }
    } catch (error) {
        // Handle error from rejected state
        toast.error("An unexpected error occurred: " + (error.message || "Unknown error"));
    }
};




  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <SigContainer>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color:"#f1f1f1"
          }}
        >
          <Logo>
          <img style={{width:"30px"}} src={logo} alt="logo"/>
            <span>AISS</span>
          </Logo>
        </Link>
        <SigForm onSubmit={handleSubmit}>
          <h3>Sign In</h3>
          <p>Sign In using your email and password.</p>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={email}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={(e) => handleChange(e)}
          />
          <div>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#3ea6ff",
              }}
            >
              Create Account
            </Link>
          </div>
          <button type="submit">Sign In</button>
        </SigForm>
      </SigContainer>
      <ToastContainer />
    </>
  );
};

const SigContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  flex-direction: column;
  gap: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;

  span {
    font-size: 1.5rem;
    font-weight: 600;
    font-family: "Fjalla One", sans-serif;
  }
`;

const SigForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: hsl(0, 0%, 7%);
  border: 1px solid hsl(0, 0%, 18.82%);
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  padding: 20px 40px;

  h3 {
    font-size: 25px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    font-weight: 300;
    color: #b5b5b5;
    margin-bottom: 20px;
  }

  input {
    height: 40px;
    width: 100%;
    border-radius: 5px;
    padding: 0 4px 0 16px;
    background-color: hsla(0, 0%, 100%, 0.05);
    border: 1px solid hsl(0, 0%, 18.82%);
    font-size: 16px;
    font-weight: 400;
    outline: none;
    color: #fff;
    font-family: inherit;
    margin-bottom: 15px;
  }

  & > div {
    font-size: 16px;
    font-weight: 300;
    color: #b5b5b5;
    margin-top: 10px;
  }

  button {
    height: 40px;
    width: 100%;
    border-radius: 5px;
    background-color: hsla(0, 0%, 100%, 0.2);
    border: 1px solid hsl(0, 0%, 18.82%);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.09);
    }
  }
`;

export default SignInPage;
