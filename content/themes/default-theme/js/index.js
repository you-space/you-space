const sections = document.getElementsByClassName('comment-section')

Array.from(sections).forEach(section => {
    const comments = section.getElementsByClassName('comment')
    Array.from(comments).forEach(comment => {
        const button = comment.querySelector('.toggle-replies')
        const replies = comment.querySelector('.comment-replies')

        if (button && replies) {
            button.addEventListener('click', () => {
                replies.classList.toggle('hidden')
            })
        }
        

    })
})