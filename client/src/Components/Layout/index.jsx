import React from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import { styled } from "styled-components";

const Layout = () => {
  return (
    <>
      <Header />
      <MainContainer>
        <SideBar />
        <div style={{
          paddingLeft:"30px"
        }}>
          <Outlet />
        </div>
      </MainContainer>
    </>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: calc(100vh - 56px);
  display: grid;
  padding: 0 16px;
  grid-template-columns: 14% 86%;
  padding-top: 10px;
`;

export default Layout;
