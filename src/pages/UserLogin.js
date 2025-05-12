

import styled from "styled-components";

import { PcUserLoginBodyCompoent } from '../component/Loginbodycomponent/PcUserLoginBodyCompoent'



const AllWrapper = styled.div`
max-width :620px;
margin: 100px auto;
`



export const UserLogin = () => {




    
    return (<>

        <AllWrapper>
           <PcUserLoginBodyCompoent></PcUserLoginBodyCompoent>
        </AllWrapper>
    </>);


}