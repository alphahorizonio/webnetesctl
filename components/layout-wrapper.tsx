import styled from "styled-components";
import LayoutTmpl from "antd/lib/layout/layout";

export const Wrapper = styled.div`
  margin-top: 64px;
  margin-left: 50px;
  margin-right: 50px;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media screen and (min-width: 812px) {
    margin-bottom: 64px;
  }
`;

export const Layout = styled(LayoutTmpl)`
  background: transparent;
`;