import styled, { css } from "styled-components";
import { PhoneNewHeader } from '../header/PhoneNewHeader'
import { PhoneLoginBody } from '../component/PhoneLoginBody/PhoneLoginBody'


const AllWrapper = styled.div`
max-width :344px;
width :344px;
`

export const PhoneLogin = () => {
    //pc 는 max-width :480px;
    //모바일은 max-width :344px;
    let ismobilelogin=true;

    return (<>
        <AllWrapper>
            <PhoneNewHeader ismobilelogin={ismobilelogin}></PhoneNewHeader>
            <PhoneLoginBody></PhoneLoginBody>
        </AllWrapper>
    </>);
}