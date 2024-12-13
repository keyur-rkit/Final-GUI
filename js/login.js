$(document).ready(function () {

    // Switch between Signup and Login forms
    $("#goToSignup").click(function () {
        $("#loginSection").hide();
        $("#signupSection").show();
    });

    $("#goToLogin").click(function () {
        $("#signupSection").hide();
        $("#loginSection").show();
    });

    $("#signupForm").validate({
        rules: {
            fullname: "required",
            username: "required",
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8
            },
            confirmPassword: {
                required: true,
                minlength: 8,
                equalTo: "#password"
            }
        },
        messages: {
            fullname: "Please enter full Name",
            username: "Please enter username",
            email: {
                required: "Please enter email",
                email: "Please enter valid email"
            },
            password: {
                required: "Please enter password ",
                minlength: "Password must be 8 char long"
            },
            confirmPassword: {
                required: "Please enter password ",
                minlength: "Password must be 8 char long",
                equalTo: "Please enter same password as above"
            }
        },
        submitHandler: function () {
            const fullname = $("#fullname").val();
            const username = $("#username").val();
            const email = $("#email").val();
            const password = $("#password").val();

            // Store user data in localStorage
            let users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.username === username || user.email === email)) {
                // alert("Username or Email already exists!");
                $.toast({
                    text: "Username or Email already exists!",
                    heading: 'signup',
                    stack: 3,
                    position: 'top-center',

                    bgColor: '#000000',
                    textColor: '#ffffff',
                    loaderBg: '#ffc107',
                });
            } else {
                users.push({ fullname, username, email, password });
                localStorage.setItem("users", JSON.stringify(users));
                // alert("Signup successful!");
                $.toast({
                    text: "Signup successful!",
                    heading: 'Signup',
                    stack: 3,
                    position: 'top-center',

                    bgColor: '#000000',
                    textColor: '#ffffff',
                    loaderBg: '#28a745',
                });
                $("#goToLogin").trigger("click");
            }
        },
    });

    $("#loginForm").validate({
        rules: {
            username: "required",
            password: {
                required: true,
                minlength: 8
            }
        },
        messages: {
            username: "Please enter username",
            password: {
                required: "Please enter password",
                minlength: "Password must be 8 char long"
            }
        },
        submitHandler: function () {
            const username = $("#loginUsername").val();
            const password = $("#loginPassword").val();

            // Retrieve user data from localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(
                user =>
                    user.username === username &&
                    user.password === password
            );

            if (user) {
                // alert("Login successful! Welcome to the Bookstore.");
                $.toast({
                    text: "Login successful! Welcome to the Bookstore.",
                    heading: 'Login',
                    stack: 3,
                    position: 'top-center',

                    bgColor: '#000000',
                    textColor: '#ffffff',
                    loaderBg: '#28a745',
                });
                localStorage.setItem("isLoggedIn", "true");
                // Redirect to the homepage or bookstore
                window.location.href = "../html/home.html";
            } else {
                // alert("Invalid username/email or password.");
                $.toast({
                    text: "Invalid username/email or password.",
                    heading: 'Login',
                    stack: 3,
                    position: 'top-center',

                    bgColor: '#000000',
                    textColor: '#ffffff',
                    loaderBg: '#ffc107',
                });
            }
        },
    });

});