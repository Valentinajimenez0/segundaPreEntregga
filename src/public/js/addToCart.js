async function addToCart(pid) {
     const cid = '6658856a23f97843b4bf3bbc';
    const url = `http://localhost:8080/api/carts/post/${cid}/product/${pid}`;

    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto agregado', data);
        } else {
            throw new Error('Error ');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}