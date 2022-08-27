const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Tệ thật, Anh lại nhớ em',
            singer: 'Thanh Hưng',
            path: './src/music/song1.mp3',
            image: './src/image/song1.jpg',
        },
        {
            name: 'Tự Sự',
            singer: 'Organe',
            path: './src/music/song2.mp3',
            image: './src/image/song2.jpg',
        },
        {
            name: 'Vậy Giữ',
            singer: 'Trung Quốc song',
            path: './src/music/song3.mp3',
            image: './src/image/song3.jpg',
        },
        {
            name: 'Bên ấy bên này',
            singer: '',
            path: './src/music/song4.mp3',
            image: './src/image/song4.jpg',
        },
        {
            name: 'Tình về nơi đâu',
            singer: 'Thanh Bùi',
            path: './src/music/song5.mp3',
            image: './src/image/song5.jpg',
        },
        {
            name: 'Em của anh đừng của ai',
            singer: 'Long Cao',
            path: './src/music/song6.mp3',
            image: './src/image/song6.jpg',
        },
        {
            name: 'Đông kiếm em',
            singer: 'Vũ',
            path: './src/music/song7.mp3',
            image: './src/image/song7.jpg',
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })

        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function(event) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; 

            cd.style.opacity = newCdWidth / cdWidth; // Mờ dần khi kéo xuống
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }      
        }

        // Khi song được play 
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        
        // Khi song bị pause 
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
       
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = (e.target.value * audio.duration) / 100
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActive();
        }

        // Khi next song
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActive();
        }

        // Xử lý bật tắt random song
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom);           
        }

        //Xử lý next song khi audio ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý lặp lại một bàn hát
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        // lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }

                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {

                }

            }
        }
    },

    scrollToActive: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    }, 
    
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        //Định nghĩa ra những thuộc tính cho object
        this.defineProperties(); 
        
        // Lắng nghe/ xử lý các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        
        //render playList
        this.render()

        this.nextSong();
    }
}

app.start();