import React, { ComponentProps } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export const withRouter = (Component: ComponentProps<any>) =>{
  function ComponentWithRouterProp(props: ComponentProps<any>) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}