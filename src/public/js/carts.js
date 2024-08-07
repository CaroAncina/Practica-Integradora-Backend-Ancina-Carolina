document.addEventListener('DOMContentLoaded', () => {
    const purchaseButton = document.getElementById('purchaseButton');
    const cartId = document.getElementById('cartId').value;

    if (purchaseButton) {
        purchaseButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Compra realizada con éxito');
                    if (result.productsNotPurchased.length > 0) {
                        alert('No se pudieron comprar algunos productos por falta de stock');
                    }
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert(`Error al realizar la compra: ${error.message}`);
                }
            } catch (error) {
                console.error('Error al realizar la compra:', error);
                alert('Error al realizar la compra');
            }
        });
    }
});
