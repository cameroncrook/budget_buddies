

document.querySelector("#delete-btn").addEventListener('click', function () {
    document.querySelector('#edit-form').classList.add('d-none');

    document.querySelector('.delete-form').classList.remove('d-none');
})

document.querySelector('.delete-form__cancel').addEventListener('click', function() {
    document.querySelector('#edit-form').classList.remove('d-none');

    document.querySelector('.delete-form').classList.add('d-none');
})

document.querySelector('.delete-form__delete').addEventListener('click', async function() {
    const url = window.location.href;

    const urlSplit = url.split('/');
    const lastIndex = urlSplit.length - 1;

    const sub_id = urlSplit[lastIndex];

    const response = await fetch(`/budget/remove-sub/${sub_id}`, {
        method: 'DELETE',
    })
    
    if (response.status == 201) {
        window.location.href = '/budget/';
    } else {
        alert("Something went wrong. Could not delete. Sorry");
    }
})

