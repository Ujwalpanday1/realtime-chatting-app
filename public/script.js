
let searchBtn=document.getElementById("searchBtn")
let form=document.getElementById("searchForm");
let searchBox=document.getElementById("searchBox");
let searchResult=document.querySelector(".searchResult")


const user=JSON.parse(window.user)
const socket=io();

socket.emit("login",user._id)

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(searchBox.value)
    searchResult.innerHTML=''
    fetch(`https://realtime-chatting-app-qnm1.onrender.com/findSuggestions/${searchBox.value}`).then((response)=>{
        response.json().then((data)=>{
            if(data.length==0){
                searchResult.innerHTML=`<img src="notFound.png"/>`
            }
            else{
                data.forEach((dat)=>{
                let suggestionItem=document.createElement('div');
                suggestionItem.className='suggestionItem'
                suggestionItem.innerHTML=`<form action="/select/${user._id}" method="get">
                <button id="searchButton" type="submit"> <div class="user">
                    ${user.fName} ${user.lName}
                </div></button></form>`
                searchResult.appendChild(suggestionItem);
            })
            }
            
            
        }).catch((err)=>console.log(err))
    }).catch((err)=>{
        console.log("error occured",err)
    })

    searchResult.style.width='60vw'
    searchResult.style.top='7.5vh'
    searchResult.style.left='-35.5vw'
})


searchBox.addEventListener("keyup",(e)=>{
    searchResult.innerHTML=''
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fetch(`https://realtime-chatting-app-qnm1.onrender.com/findSuggestions/${searchBox.value}`).then((response)=>{
            response.json().then((data)=>{
                data.forEach((dat)=>{
                    let suggestionItem=document.createElement('div');
                    suggestionItem.className='suggestionItem'
                    suggestionItem.innerHTML=`<form action="/select/${user._id}" method="get">
                    <button id="searchButton" type="submit"> <div class="user">
                        ${user.fName} ${user.lName}
                    </div></button></form>`
                    searchResult.appendChild(suggestionItem);
                })
                
            }).catch((err)=>console.log(err))
        }).catch((err)=>{
            console.log("error occured",err);
        })
    }, 300); 
    
})