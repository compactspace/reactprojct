

import styled from "styled-components";

import { LoginBodyComponent } from '../component/Loginbodycomponent/LoginBodyComponent'



const AllWrapper = styled.div`
max-width :620px;
margin: 100px auto;
`



export const GeneralTeacherLogin = () => {



    return (<>

        <AllWrapper>
            <LoginBodyComponent></LoginBodyComponent>
        </AllWrapper>
    </>);


}