document.addEventListener("DOMContentLoaded", function () {

    var current = null;
    document.querySelector('#email').addEventListener('focus', function (e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: 0,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '240 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
    document.querySelector('#password').addEventListener('focus', function (e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -336,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '240 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
    document.querySelector('#submit').addEventListener('focus', function (e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -730,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '530 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });

// call google api to auth

    function toggleSingin() {
        if (!firebase.auth().currentUser) {
            let provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            firebase.auth().signInWithRedirect(provider);
        } else {
            firebase.auth().signOut();
        }
    }

    function initApp() {
        firebase.auth().getRedirectResult().then(function (result) {
            if (result.credential) {
                let token = result.credential.accessToken;
                let user = result.user;
                let e_mail = user.email;
                let display_name = user.displayName;
                let emailVerified = user.emailVerified;
                let uid = user.uid;
            }
        }).catch(function (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;

            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
            }
        });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                let userToken, userEmail, userId, pass_param

                user.getIdToken().then(function (idToken) {  // <------ Check this line
                    userToken = idToken;
                    userEmail = user.email;
                    userId = user.uid;

                    pass_param = {
                        token: userToken,
                        e_mail: userEmail,
                        uid: userId,
                    };

                    $.ajax({
                        url: '/blog/google/auth',
                        type: 'POST',
                        data: JSON.stringify(pass_param),
                        contentType: "application/json",
                    })
                        .done(function (data) {
                            console.log(data)
                        })
                        .fail(function (error) {
                            console.log(error)
                            console.log(JSON.parse(JSON.stringify(pass_param)))
                        })

                });


            } else {

            }
        });

        document.getElementById('submit').addEventListener('click', toggleSingin, false);
    }

    window.onload = function () {
        initApp();
    };
});


