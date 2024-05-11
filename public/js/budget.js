
const signOutBtn = document.querySelector("#sign-out");
signOutBtn.addEventListener('click', function () {
    const overlay = document.createElement('div');
    overlay.className = "overlay";

    overlay.innerHTML = `
    <p>Confirm Logout</p>
    <form class="logout-form" action="/account/logout" method="post">
        <input id="cancel-btn" type="button" value="CANCEL" >
        <input type="submit" value="SIGN OUT" >
    </form>
    `;

    overlay.querySelector('#cancel-btn').addEventListener('click', function() {
        document.querySelector('main').removeChild(overlay);
    });

    document.querySelector('main').appendChild(overlay);
});

const shareBtn = document.querySelector("#share");
shareBtn.addEventListener('click', async function () {
    
    const shareCodeResponse = await fetch("/budget/get-share-code");
    const shareCodeData = await shareCodeResponse.json();
    const shareCode = `http://budgetbuddies.fieldtechinnovations.com/account/register/${shareCodeData.shareCode}`;

    const overlay = document.createElement('div');
    overlay.className = "overlay share";

    overlay.innerHTML = `
    <div class="share__close">
        <img id="share-close" src="/images/cross.png" alt="close">
    </div>
    <p class="share__title">Send this code to your budget buddy!</p>
    <div class="share__code">
        <p>Share URL</p>
        <div>
            <p id="share-code">${shareCode}</p>
            <button id="share-btn">Copy</button>
        </div>
    </div>
    `;

    overlay.querySelector('#share-close').addEventListener('click',function () {
        document.querySelector('main').removeChild(overlay);
    });

    overlay.querySelector('#share-btn').addEventListener('click', function () {
        // shareCode.select();
        // shareCode.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(shareCode);

        overlay.querySelector('#share-btn').textContent = "Copied";
    });

    document.querySelector('main').appendChild(overlay);
})
