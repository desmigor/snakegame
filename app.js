document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const scoreDisplay = document.querySelector('.scorecount')
    const statusDisplay = document.querySelector('.statusDisplay')
    const startBtn = document.querySelector('.start')
    const pauseBtn = document.querySelector('.pause')

    const width = 10
    let currentIndex = 0 //first div in our grid
    let appleIndex = 0 // first div in our grid
    let currentSnake = [2, 1, 0] // 2 for head, 0 the end
    let direction = 1
    let score = 0
    let speed = 0.9
    let intervalTime = 0
    let interval = 0

    // Start and restart the gridTemplateAreas: 
    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove('snake'))
        squares[appleIndex].classList.remove('apple')
        clearInterval(interval)
        score = 0
        randomApple()
        direction = 1
        scoreDisplay.innerText = score
        statusDisplay.style.color = "rgb(39, 170, 89)"
        statusDisplay.textContent = 'Playing'
        intervalTime = 1000
        currentSnake = [2, 1, 0]
        currentIndex = 0
        currentSnake.forEach(index => squares[index].classList.add('snake'))
        interval = setInterval(moveOutcomes, intervalTime)
    }


    //function that deals with all the over outcomes of the snake
    function moveOutcomes() {
        //deals with snake hitting border and snake hitting self
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) || //Hitting bottom
            (currentSnake[0] % width === width - 1 && direction === 1) || //Hitting right wall
            (currentSnake[0] % width === 0 && direction === -1) || //Hitting left wall
            (currentSnake[0] - width < 0 && direction === -width) || //Hitting the top
            squares[currentSnake[0] + direction].classList.contains('snake') //Hitting itself
        ) {
            statusDisplay.style.color = "#f74545"
            statusDisplay.textContent = 'Lost'
            return clearInterval(interval) // clear the interval
        }

        const tail = currentSnake.pop() //removes last item of the array and shows it
        squares[tail].classList.remove('snake') // removes class of the snake from the tail
        currentSnake.unshift(currentSnake[0] + direction) //gives direction to the head of the array

        //deals with snake getting apple ...
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple')
            squares[tail].classList.add('snake')
            currentSnake.push(tail)

            randomApple()
            score++
            scoreDisplay.textContent = score
            clearInterval(interval)
            intervalTime = intervalTime * speed
            interval = setInterval(moveOutcomes, intervalTime)
        }

        squares[currentSnake[0]].classList.add('snake')
    }


    //pause and resume game
    let paused = false;

    function PauseResume() {
        if (paused === false) {
            clearInterval(interval);
            paused = true;
            statusDisplay.style.color = "#ebc334"
            statusDisplay.textContent = 'Paused'
        } else if (paused === true) {
            statusDisplay.style.color = "rgb(39, 170, 89)"
            statusDisplay.textContent = 'Playing'
            interval = setInterval(function() {
                requestAnimationFrame(moveOutcomes)
            }, intervalTime)
            paused = false;
        }
    }



    //generate new apple once apple is eaten
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length)
        } while (squares[appleIndex].classList.contains('snake')) //making sure apples dont appear on the snake
        squares[appleIndex].classList.add('apple')
    }


    //assign function to keycodes
    function control(e) {
        squares[currentIndex].classList.remove('snake') //Removing the class of snake

        if (e.keyCode === 39) {
            direction = 1 // right arrow
        } else if (e.keyCode === 38) {
            direction = -width // up arrow
        } else if (e.keyCode === 37) {
            direction = -1 // left arrow
        } else if (e.keyCode === 40) {
            direction = +width // down arrow, snake head goes ten divs from where it wordSpacing: 
        }
    }

    document.addEventListener('keyup', control)
    startBtn.addEventListener('click', startGame)
    pauseBtn.addEventListener('click', PauseResume)

})