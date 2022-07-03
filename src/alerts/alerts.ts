import Swal from "sweetalert2"
export const startGameAlert = (): void => {
    Swal.fire({
        title: 'Start!',
        text: 'Try your hardest...',
        imageUrl: 'https://steamsplay.com/wp-content/uploads/2021/07/witch-it-how-to-launch-the-game-fast-and-easy-7-steamsplay-com-7868787.jpg',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'start game',

    })
}
export const wrongGuessAlert = (): void => {

    const failGuessText = ['Try Again', 'Try Harder', 'Incorrect']

    Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast-error'
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    }).fire(failGuessText[getRandomInt(3)],)

}

export const correctGuessAlert = (): void => {

    const failGuessText = ['Nice!', 'Good job!', "I'm lovin' it!"]

    Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast-correct'
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    }).fire(failGuessText[getRandomInt(3)],)

}
export const endGameAlert = (restartGame: Function, isWin: boolean): void => {

    let title = 'You Lose'
    if (isWin) {
        title = 'You Win, congrats!'
    }
    Swal.fire({
        title,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Retry'
    })
        .then(() => {
            restartGame()
        })

}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}