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
            fullname: {
                required: true,
                regex: /^[A-Za-z]+$/
            },
            username: {
                required: true,
                noWhitespace: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8,
                noWhitespace: true
            },
            confirmPassword: {
                required: true,
                minlength: 8,
                equalTo: "#password",
                noWhitespace: true
            }
        },
        messages: {
            fullname: {
                required: "Please enter full Name",
                regex: "Only letters are allowed"
            },
            username: {
                required: "Please enter username",
                noWhitespace: "Username cannot contain spaces"
            },
            email: {
                required: "Please enter email",
                email: "Please enter a valid email"
            },
            password: {
                required: "Please enter password",
                minlength: "Password must be 8 characters long",
                noWhitespace: "Password cannot contain spaces"
            },
            confirmPassword: {
                required: "Please enter password",
                minlength: "Password must be 8 characters long",
                equalTo: "Please enter the same password as above",
                noWhitespace: "Password cannot contain spaces"
            }
        },
        submitHandler: function () {
            const fullname = $("#fullname").val().trim();
            const username = $("#username").val().trim();
            const email = $("#email").val().trim();
            const password = $("#password").val().trim();
    
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
            username: {
                required: true,
                noWhitespace: true
            },
            password: {
                required: true,
                minlength: 8,
                noWhitespace: true 
            }
        },
        messages: {
            username: {
                required: "Please enter username",
                noSpaces: "Username cannot contain spaces"
            },
            password: {
                required: "Please enter password",
                minlength: "Password must be 8 characters long",
                noSpaces: "Password cannot contain spaces"
            }
        },
        submitHandler: function () {
            const username = $("#loginUsername").val().trim(); // Trim username
            const password = $("#loginPassword").val().trim(); // Trim password

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

    // to handle only white spaces in input
    // custom validation rule noWhitespace
    $.validator.addMethod("noWhitespace", function(value) {
        return !/\s/.test(value); // Ensures there are no spaces anywhere in the string
    }, "Username cannot contain spaces.");

    // Custom method to validate only alphabets and spaces
    $.validator.addMethod("regex", function(value, element, param) {
       return this.optional(element) || param.test(value);
    }, "Please enter a valid input.");

});