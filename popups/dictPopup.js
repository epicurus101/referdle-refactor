let dictModal = document.createElement("div");
dictModal.setAttribute("id", `dict-popup`);
dictModal.classList.add("animate__animated");

document.addEventListener('showDictPopup', (e) => {

    const board = e.detail.board
    dictModal.textContent = e.detail.message

    if (dictModal.parentNode) {
        dictModal.parentNode.removeChild(dictModal);
      }

    board.boardDiv.appendChild(dictModal)

    setPosition(board)

});

function setPosition(board){
    const container = board.boardDiv.querySelector('.square-container')
    const square1 = board.getSquare(board.guessedWordCount * 5 + 1)
    const square5 = board.getSquare(board.guessedWordCount * 5 + 5)
    const unit = square1.offsetHeight * 0.1
    const cumTop = square1.offsetTop + unit
    const cumLeft = container.offsetLeft + square1.offsetLeft + unit
    const cumRight = container.offsetLeft + square5.offsetLeft + square5.offsetWidth - unit

    dictModal.style.top = cumTop+'px'
    dictModal.style.height = (square1.offsetHeight-unit*2)+'px'
    dictModal.style.left = cumLeft+'px'
    dictModal.style.width = (cumRight-cumLeft)+'px'
    dictModal.style.lineHeight = dictModal.offsetHeight+'px'
    dictModal.style.borderRadius = (unit * 3)+'px'
    dictModal.style.fontSize = `${square1.offsetHeight * 0.35}px`

    dictModal.classList.remove("animate__tada")
    dictModal.classList.remove("animate__fadeOutDown")
    dictModal.style.animationDuration = '1s'
    dictModal.classList.add("animate__tada");
    setTimeout(fadeAway, 1000)

}

function fadeAway(){
    dictModal.classList.remove("animate__tada")
    dictModal.style.animationDuration = '1s'
    dictModal.classList.add("animate__fadeOutDown");
}
