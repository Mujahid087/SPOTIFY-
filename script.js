let currentsong = new Audio();

//   this function converts seconds to minutessecond format

function secondsToMinutesSeconds(seconds){
  if(isNaN(seconds) || seconds<0){
    return "00:00";
  }
  const minutes=Math.floor(seconds/60);
  const remainingseconds=Math.floor(seconds%60);

  const formattedminutes=String(minutes).padStart(2, '0');
  const formattedseconds=String(remainingseconds).padStart(2, '0');

  return `${formattedminutes}:${formattedseconds}`;
}


async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/")
  let response = await a.text();
  console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1])
    }

  }
  return songs
}

const playMusic = (track,pause=false) => {
  let audio=new Audio("/songs/"+track)

   currentsong.src = "/songs/" +encodeURI(track)
   if(!pause){
     currentsong.play();
   }
 
  play.src = "pause.svg"
  document.querySelector(".songinfo").innerHTML = decodeURIComponent(track)
  document.querySelector(".songtime").innerHTML = "00:00 : 00:00"
}

async function main() {
  let songs = await getsongs();
   playMusic(songs[0],true)

  // show all the songs in the playlist
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="music.svg">
              <div class="info">
                <div> ${song.replaceAll("%20", " ")}</div>
                <div>Mujahid</div>

              </div>
              <div class="playnow">
                <span>playnow</span>
                <img class="invert" src="play.svg">
              </div></li>`;

  }

  //  attach an event listener to every song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })

  })
  //  attach an eventlistener to play next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg"
    }
    else {
      currentsong.pause();
      play.src = "play.svg"
    }
  })

  // listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}:${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration) * 100 + "%";
  })

 
  //  add an eventlistener to the seek bar
   document.querySelector(".seekbar").addEventListener("click" , e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left=percent+ "%"
    currentsong.currentTime=((currentsong.duration)*percent )/100;

   })

  //  add an eventlistener for hamvburger
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
  })

  // add an event listener for close
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%" 
})
 
  





}
main();
