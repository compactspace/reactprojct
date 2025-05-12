
import axios from "axios"





export const JavaSocketChannerEx01 = () => {




    const 통신하기 = () => {

        
        let headers={"Content-Type":"application/json",
            
            "ssssssssssss":"sssssssssssssssss"}
            
            let data={key1:"Hello_World"}


        axios.post('http://localhost:8000/test',{data},{headers}).then((res) => {

            
        })
            .catch((err) => {
                console.log(err)
            })

    }


    return (<>
        <h1 onClick={통신하기}>자바양방향소켓채널서버와통신하기 클릭</h1>

    </>);
}