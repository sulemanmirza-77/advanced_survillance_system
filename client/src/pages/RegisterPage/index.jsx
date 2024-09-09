import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { BsYoutube } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register, reset } from "../../redux/auth/authSlice";
import Loader from "../../Components/Loader";
import logo from '../../assets/images/logo.png';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    comPassword: "",
  });

  const { name, email, password, comPassword } = formData;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !comPassword) {
      toast.error("Please fill all the fields.");
    } else if (password !== comPassword) {
      toast.error("Password and Confirm Password are not matching.");
    } else {
      try {
        const userData = {
          name,
          email,
          password,
        };
        dispatch(register(userData));
        toast.info("Process is successful.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        toast.error("Error! Check your information.");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <RegContainer>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#f1f1f1",
          }}
        >
          <Logo>
          <img style={{width:"30px"}} src={logo} alt="logo"/>
            <span>AISS</span>
          </Logo>
        </Link>
        <RegForm onSubmit={handleSubmit}>
          <h3>Register</h3>
          <p>Register using your email and password.</p>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={name}
            onChange={(e) => handleChange(e)}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            name="comPassword"
            value={comPassword}
            onChange={(e) => handleChange(e)}
          />
          <div>
            Already have an account?{" "}
            <Link
              to="/sign_in"
              style={{
                color: "#3ea6ff",
              }}
            >
              Sign in
            </Link>
          </div>
          <button type="submit">Register</button>
        </RegForm>
      </RegContainer>
      <ToastContainer />
    </>
  );
};

const RegContainer = styled.div`
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

const RegForm = styled.form`
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

export default RegisterPage;
