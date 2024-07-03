
let searchBtn=document.getElementById("searchBtn")
let form=document.getElementById("searchForm");
let searchBox=document.getElementById("searchBox");


const user=JSON.parse(window.user)
const socket=io();

socket.emit("login",user._id)
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(searchBox.value)
    form.action=`/find/${searchBox.value}`
    form.submit()
})