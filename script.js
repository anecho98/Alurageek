document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.querySelector('[data-product]');
    const noProductsMessage = document.getElementById('no-products-message');

    function checkForNoProducts() {
        if (productsContainer.children.length === 0) {
            noProductsMessage.style.display = 'block';
        } else {
            noProductsMessage.style.display = 'none';
        }
    }

    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            if (products.length === 0) {
                noProductsMessage.style.display = 'block';
            } else {
                noProductsMessage.style.display = 'none';
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('card');
                    productCard.innerHTML = `
                        <div class="img-container">
                            <img src="${product.image}" alt="img">
                        </div>
                        <div class="card-container-info">
                            <p>${product.name}</p>
                            <div class="card-container-value">
                                <p>$ ${product.price}</p>
                                <button class="delete-button" data-id="${product.id}">
                                    <img src="./images/trash-icon.png" alt="Eliminar">
                                </button>
                            </div>
                        </div>
                    `;
                    productsContainer.appendChild(productCard);
                });
            }
        });

    const form = document.querySelector('[data-form]');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.querySelector('[data-name]').value;
        const price = parseFloat(document.querySelector('[data-price]').value);
        const image = document.querySelector('[data-image]').value;

        const newProduct = {
            name,
            price,
            image
        };

        fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('card');
            productCard.innerHTML = `
                <div class="img-container">
                    <img src="${product.image}" alt="img">
                </div>
                <div class="card-container-info">
                    <p>${product.name}</p>
                    <div class="card-container-value">
                        <p>$ ${product.price}</p>
                        <button class="delete-button" data-id="${product.id}">
                            <img src="./images/trash-icon.png" alt="Eliminar">
                        </button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productCard);
            checkForNoProducts();
        });

        form.reset();
    });

    productsContainer.addEventListener('click', (event) => {
        if (event.target.closest('.delete-button')) {
            const button = event.target.closest('.delete-button');
            const productId = button.getAttribute('data-id');

            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE'
            })
            .then(() => {
                button.closest('.card').remove();
                checkForNoProducts();
            });
        }
    });
});
