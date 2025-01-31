$(document).ready(function () {

    // Check login state
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        // Show Logout button
        $("#authBtn").html('<a class="nav-link" href="#" id="logoutBtn">Logout</a>');
    } else {
        // Show Login button
        $("#authBtn").html('<a class="nav-link" href="login.html" id="loginBtn">Login</a>');
    }

    // Logout functionality with Event Delegation
    $("#navbarNav").on("click", "#logoutBtn", function (e) {
        e.preventDefault();
        // Clear login state
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("users");
        $.toast({
            text: "You have been logged out.",
            heading: 'Logout',
            stack: 3,
            position: 'top-center',

            bgColor: '#000000',
            textColor: '#ffffff',
            loaderBg: '#dc3545',
        });
        // Refresh page 
        window.location.href = "home.html";
    });

    // Define the Book class
    class Book {
        constructor(id, title, imageURL, price) {
            this.id = id;
            this.title = title;
            this.imageURL = imageURL;
            this.price = price;
        }
    }

    class Details extends Book {
        constructor(id, title, imageURL, price, author, publisher, desc) {
            super(id, title, imageURL, price);
            this.author = author;
            this.publisher = publisher;
            this.desc = desc;
        }
    }

    // Define the Bookstore class
    class Bookstore {
        constructor() {
            this.books = []; // Array to hold book objects
        }

        // Add a book to the bookstore
        addBook(book) {
            this.books.push(book);
        }

        // Search books by title
        searchBooks(searchText) {
            $(".book-item").each(function () {
                let bookTitle = $(this).data("title").toLowerCase();
                if (bookTitle.includes(searchText)) {
                    $(this).removeClass("hidden");
                } else {
                    $(this).addClass("hidden");
                }
            });
        }
    }

    // Initialize the bookstore
    const bookstore = new Bookstore();

    // Search functionality
    $("#search-input").on("keyup", function () {
        let searchText = $(this).val().toLowerCase();

        bookstore.searchBooks(searchText);
    });

    // Fetch books from API
    let promise = $.ajax({
        url: "https://mocki.io/v1/6cac9289-8c20-4567-8107-ba66e2c81dcb",
        method: "GET",
    });

    // https://api.itbook.store/1.0/new
    // https://mocki.io/v1/6cac9289-8c20-4567-8107-ba66e2c81dcb (without dummy img)
    // https://mocki.io/v1/513c1c7b-a224-4573-8e35-394205db7644 (with dummy img)

    promise
        .done(function (data) {
            booksArr = data.books;

            $.each(booksArr, function (index, book) {
                bookstore.addBook(new Book(book.isbn13, book.title, book.image, parseFloat(book.price.slice(1))));
            });

            renderBooksTable();
        })
        .fail(function () {
            // alert("Failed to fetch books from the server.");
            $.toast({
                text: "Failed to fetch books from the server.",
                heading: 'Fetch',
                stack: 3,
                position: 'top-center',

                bgColor: '#000000',
                textColor: '#ffffff',
                loaderBg: '#dc3545',
            });
        })


    // Render books in the admin table
    function renderBooksTable() {
        const tableBody = $("#book-container");
        tableBody.empty();

        bookstore.books.forEach(book => {
            tableBody.append(`
                <div class="col-md-6 col-lg-3 mb-4 book-item" id="b${book.id}" data-title="${book.title}">
                    <div class="card">
                        <img src="${book.imageURL}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title book-title">${book.title}</h5>
                            <p class="card-text">$${book.price}</p>
                            <button class="btn btn-success addToCartBtn" data-id="${book.id}" data-name="${book.title}"
                                data-price="${book.price}">Add to Cart</button>
                            <button class="btn btn-outline-primary view-details-btn" data-id="${book.id}" >View Details</button>
                        </div>
                    </div>
                </div>
                
            `);
        });
    }

    // extra book details for modal  
    $("#book-container").on("click", ".view-details-btn", function () {
        // Get the book ID from the parent book card
        const bookId = $(this).data("id");

        // https://api.itbook.store/1.0/books/${bookId}
        // https://mocki.io/v1/513c1c7b-a224-4573-8e35-394205db7644 (with dummy img)
        
        // Fetch book details
        $.ajax({
            url: `https://mocki.io/v1/513c1c7b-a224-4573-8e35-394205db7644`,
            method: "GET",
            success: function (data) {
                const book = new Details(data.isbn13, data.title, data.image, parseFloat(data.price.slice(1)), data.authors, data.publisher, data.desc);
                if (book) {
                    $("#book-title").text(book.title);
                    $("#book-author").text(book.author);
                    $("#book-publisher").text(book.publisher);
                    const decodeBookDecs = decodeHTMLEntities(book.desc);
                    $("#book-description").text(decodeBookDecs);
                    $("#book-price").text(`$${book.price}`);

                    // Open the modal
                    $("#bookDetailsModal").modal("show");
                }
            },
            error: function () {
                // alert("Failed to fetch books from the server.");
                $.toast({
                    text: "Failed to fetch books from the server.",
                    heading: 'Fetch',
                    stack: 3,
                    position: 'top-center',

                    bgColor: '#000000',
                    textColor: '#ffffff',
                    loaderBg: '#ffc107',
                });
            }
        });

        // to decode book decs 
        function decodeHTMLEntities(text) {
            return $("<textarea/>").html(text).text();
        }

    });


    let cart = [];

    // Add item to cart
    $("#book-container").on("click", '.addToCartBtn', function () {

        if (localStorage.users) {
            const bookId = $(this).data("id");
            const bookName = $(this).data("name");
            const price = parseFloat($(this).data("price"));

            const existingItem = cart.find(item => item.id === bookId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: bookId, name: bookName, price: price, quantity: 1 });
            }

            updateCart();
            $.toast({
                text: "Book added to cart",
                heading: 'Cart',
                stack: 3,
                position: 'top-center',

                bgColor: '#000000',
                textColor: '#ffffff',
                loaderBg: '#28a745',
            });
        }
        else {
            $.toast({
                text: "login/signup to use cart!!",
                heading: 'Cart',
                stack: 3,
                position: 'top-center',

                bgColor: '#000000',
                textColor: '#ffffff',
                loaderBg: '#ffc107',
            });
        }
    });

    // Remove item from cart
    function removeFromCart(bookId) {
        cart = $.grep(cart, function (item) {
            return item.id !== bookId;
        });
        updateCart();
    }

    // Remove from cart handler
    window.removeFromCart = removeFromCart; // Expose to global scope for dynamic buttons

    // Update cart display
    function updateCart() {
        const cartItemsContainer = $("#cartItems");
        const cartTotalContainer = $("#cartTotal");
        cartItemsContainer.empty();

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItemsContainer.append(`
                    <tr>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td>$${itemTotal.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
                    </tr>
                `);
        });

        cartTotalContainer.text(`Total: $${total.toFixed(2)}`);
    }

    // Checkout button functionality
    $("#checkoutBtn").on("click", function () {
        if (cart.length > 0) {
            // alert("Proceeding to checkout...");
            $.toast({
                text: "Proceeding to checkout...",
                heading: 'Checkout',
                stack: 3,
                position: 'top-center',

                bgColor: '#000000',
                textColor: '#ffffff',
                loaderBg: '#007bff',
            });
            cart = []; // Clear the cart
            updateCart();
        } else {
            // alert("Your cart is empty!");
            $.toast({
                text: "Your cart is empty!",
                heading: 'Checkout',
                stack: 3,
                position: 'top-center',

                bgColor: '#000000',
                textColor: '#ffffff',
                loaderBg: '#ffc107',
            });
        }
    });

});
