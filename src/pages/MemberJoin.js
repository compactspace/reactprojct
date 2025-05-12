import axios from "axios";

import styled, { css } from "styled-components";
import { MemberJoinBodyCompoent } from '../component/memberjoinbodycomponent/MemberJoinBodyCompoent'
export const MemberJoin = () => {

    const AllWrapper = styled.div`
    display:flex;
    flex-direction:column;
    height: 100vh;
    justify-content: center;


    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .08);
    border-radius: 0.5rem;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    width: 486px;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;




    `;



    return (<>

        <AllWrapper>
            <MemberJoinBodyCompoent>

            </MemberJoinBodyCompoent>

        </AllWrapper>

    </>);
}