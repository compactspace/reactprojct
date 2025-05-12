
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { putUserid, deleUserid } from './store'

export const PersistTestPage = () => {
    let dispatch = useDispatch();
    let 스테이트담은변수 =useSelector((state) => { return state.cookie });

    
    useEffect(()=>{
        let btn = document.getElementById('btn');
        
        btn.addEventListener("click", () => {
            dispatch(putUserid("퍽유"))
            
            console.log(스테이트담은변수);
        });

    },[])


    return (
        <button id="btn">스테이이트값 변경</button>
    );
}