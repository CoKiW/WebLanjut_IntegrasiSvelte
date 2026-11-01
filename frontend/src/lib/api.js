const BASE_URL = "http://localhost:3000/produk";

async function request(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "Terjadi kesalahan, coba lagi"
        );
    }

    return data;
}

export const getProduk = () => request(BASE_URL);

export const createProduk = (body) =>
    request(BASE_URL, { method: "POST", body: JSON.stringify(body) });

export const updateProduk = (id, body) =>
    request(`${BASE_URL}/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteProduk = (id) =>
    request(`${BASE_URL}/${id}`, { method: "DELETE" });
