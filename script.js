
const API_KEY="YOUR_OPENAI_API_KEY";
const chat=document.getElementById("chat");

/* ================= LOGIN ================= */

function login(){
const name=document.getElementById("username").value.trim();
if(!name) return;
localStorage.setItem("jjUser",name);
document.getElementById("login").style.display="none";
document.getElementById("app").style.display="flex";
loadChat();
}

function logout(){
localStorage.clear();
location.reload();
}

/* ================= MEMORY ================= */

function saveChat(){
localStorage.setItem("jjChat",chat.innerHTML);
}

function loadChat(){
chat.innerHTML=localStorage.getItem("jjChat")||"";
}

/* ================= ADD MESSAGE ================= */

function addMessage(text,type){

const msg=document.createElement("div");
msg.className="msg "+type;
msg.innerText=text;

chat.appendChild(msg);
chat.scrollTop=chat.scrollHeight;
saveChat();
}

/* ================= SUGGESTION ================= */

function fill(text){
document.getElementById("userInput").value=text;
}

/* ================= ===== SMART NLP DATA (20+) ===== ================= */

const knowledgeBase = [

{keys:["hi","hello","hey","hii"], answer:"Welcome to BLAZE AI 👋"},
{keys:["who are you","your name"], answer:"I am BLAZE AI 🤖 Your Smart Assistant."},
{keys:["services","what do you do"], answer:"AI answers, Image generation, File reading, Voice support."},
{keys:["time","current time"], answer:()=>`Time: ${new Date().toLocaleTimeString()}`},
{keys:["date","today date"], answer:()=>`Date: ${new Date().toLocaleDateString()}`},

{keys:["ai","artificial intelligence"], answer:"AI makes machines think like humans."},
{keys:["machine learning","ml"], answer:"ML allows systems to learn from data automatically."},
{keys:["deep learning"], answer:"Deep Learning uses neural networks for advanced AI."},

{keys:["frontend"], answer:"Frontend = UI built with HTML, CSS, JavaScript."},
{keys:["backend"], answer:"Backend handles server & database logic."},
{keys:["full stack"], answer:"Full Stack = Frontend + Backend + Database."},

{keys:["database"], answer:"Database stores data using MySQL, MongoDB etc."},
{keys:["cloud"], answer:"Cloud computing provides online servers like AWS & Azure."},
{keys:["cyber security"], answer:"Cyber Security protects systems from hackers."},

{keys:["blockchain"], answer:"Blockchain is a secure distributed ledger technology."},
{keys:["crypto","cryptocurrency"], answer:"Crypto like Bitcoin uses blockchain technology."},

{keys:["app development"], answer:"App development builds mobile apps using Flutter/React Native."},
{keys:["web development"], answer:"Web development builds modern websites & apps."},

{keys:["seo"], answer:"SEO improves website ranking on Google."},
{keys:["freelancing"], answer:"Freelancing means working independently for clients."},

{keys:["career"], answer:"Tech careers: Developer, AI Engineer, Data Scientist, Cyber Expert."},
{keys:["motivation","motivate"], answer:"Consistency + Hard Work = Success 💪"},
{keys:["bye","goodbye"], answer:"Bye 👋 Thanks for using BLAZE AI!"},

{keys:["motivate"], answer:"Consistency builds success 💪"},
{keys:["syed warden"], answer:"Warden of kkdgms. He controls 296 boys in his single finger."},
{keys:["sojith"], answer:"He is studing in kkdgms .He is a gana singer .He is popularly known as KUMARI VEDAN "},
{keys:["humanities first batch 2024-26"], answer:"1.nishok 2.manikandan 3.balaji 4.sabarish 5.veera mani 6.sooraj 7.raghava hari8.godwin rabins 9.mithun"},
{keys:["jj techz"],answer:"JJ TECHZ is a dynamic and innovative web development company committed to helping businesses grow through modern technology solutions. With creativity, technical expertise, and a passion for innovation, JJ TECHZ aims to transform ideas into powerful digital experiences.JJ TECHZ was founded by J.JAFRO, a visionary entrepreneur with a strong interest in web technologies and digital innovation. As the Founder J. Jafro established the company with a clear mission to deliver high-quality, reliable, and affordable web solutions for businesses of all sizes. His leadership and forward-thinking mindset continue to guide the company toward excellence.Supporting this vision is the Co-Founder, S. Akilesh, whose dedication and technical knowledge play a vital role in the company’s growth.", image:"jj.png"}, 
{keys:["kkdgms"], answer:"KKDGMS-KanniyaKumari District Government Model School.It is a residential school.There are more than 400 students are studying ",image:"jamcet.jpg"},

];

/* ================= NLP MATCH ENGINE ================= */

function checkLocal(input){

input=input.toLowerCase();
const words=input.split(" ");

for(let item of knowledgeBase){
for(let key of item.keys){

if(words.includes(key) || input.includes(key)){
return typeof item.answer==="function"
? item.answer()
: item.answer;
}
}
}

return null;
}

/* ================= AI ================= */

async function getAI(prompt){

try{
const res=await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+API_KEY
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[{role:"user",content:prompt}]
})
});

const data=await res.json();
return data.choices[0].message.content;

}catch(err){
return "SORRY,I AM STILL LEARNING";
}
}

/* ================= SEND MESSAGE ================= */

async function sendMessage(){

const input=document.getElementById("userInput");
const text=input.value.trim();
if(!text) return;

addMessage(text,"user");
input.value="";

let localReply=checkLocal(text);

if(localReply){
addMessage(localReply,"bot");
}
else{
addMessage("Thinking...","bot");
const reply=await getAI(text);
chat.lastChild.remove();
addMessage(reply,"bot");
}
}

/* ================= IMAGE ================= */

function generateImage(){

let promptText=prompt("Enter Image Prompt:");
if(!promptText) return;

addMessage("Image: "+promptText,"user");

setTimeout(()=>{
addMessage("","bot");
chat.lastChild.innerHTML=
`<img src="https://source.unsplash.com/500x300/?${encodeURIComponent(promptText)}"
style="width:100%;border-radius:10px">`;
},1500);
}

/* ================= FILE ================= */

function readFile(event){

const file=event.target.files[0];
if(!file) return;

const reader=new FileReader();
reader.onload=function(e){
addMessage("File Content:\n"+e.target.result,"bot");
};
reader.readAsText(file);
}

/* ================= VOICE ================= */

function startVoice(){

if(!('webkitSpeechRecognition'in window))
return alert("Voice not supported");

const recognition=new webkitSpeechRecognition();
recognition.lang="en-US";
recognition.start();

recognition.onresult=function(e){
document.getElementById("userInput").value=
e.results[0][0].transcript;
sendMessage();
};
}

/* ================= EXTRA FEATURES ================= */

function clearChat(){
chat.innerHTML="";
localStorage.removeItem("jjChat");
}

function toggleTheme(){
document.body.classList.toggle("light");
}

function downloadChat(){
const text=chat.innerText;
const blob=new Blob([text],{type:"text/plain"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="chat.txt";
a.click();
URL.revokeObjectURL(url);
}

/* ================= AUTO LOGIN ================= */

if(localStorage.getItem("jjUser")){
document.getElementById("login").style.display="none";
document.getElementById("app").style.display="flex";
loadChat();
}

/* ================= TYPING LOADER ================= */

function showTyping(){

const typing=document.createElement("div");
typing.className="msg bot";

typing.innerHTML=`
<div class="typing">
<span></span>
<span></span>
<span></span>
</div>
`;

chat.appendChild(typing);
chat.scrollTop=chat.scrollHeight;

return typing;
}
