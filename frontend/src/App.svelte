<script>
    import { onMount } from "svelte";
    import {
        getProduk,
        createProduk,
        updateProduk,
        deleteProduk,
    } from "./lib/api.js";

    let produk = $state([]);
    let form = $state({ nama: "", harga: "", stok: "" });
    let editId = $state(null);
    let error = $state("");
    let loading = $state(false);

    async function muatData() {
        try {
            produk = await getProduk();
            error = "";
        } catch (e) {
            error = e.message;
        }
    }

    onMount(muatData);

    function resetForm() {
        form = { nama: "", harga: "", stok: "" };
        editId = null;
    }

    async function simpan(event) {
        event.preventDefault();
        loading = true;

        const body = {
            nama: form.nama,
            harga: Number(form.harga),
            stok: Number(form.stok),
        };

        try {
            if (editId === null) {
                await createProduk(body);
            } else {
                await updateProduk(editId, body);
            }
            resetForm();
            await muatData();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    function edit(item) {
        editId = item.id;
        form = { nama: item.nama, harga: item.harga, stok: item.stok };
    }

    async function hapus(id) {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            await deleteProduk(id);
            if (editId === id) resetForm();
            await muatData();
        } catch (e) {
            error = e.message;
        }
    }
</script>

<main>
    <h1>Data Produk</h1>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    <form onsubmit={simpan}>
        <h2>{editId === null ? "Tambah Produk" : "Edit Produk"}</h2>

        <label>
            Nama
            <input type="text" bind:value={form.nama} required />
        </label>

        <label>
            Harga
            <input type="number" min="0" bind:value={form.harga} required />
        </label>

        <label>
            Stok
            <input type="number" min="0" bind:value={form.stok} required />
        </label>

        <div class="actions">
            <button type="submit" disabled={loading}>
                {editId === null ? "Simpan" : "Update"}
            </button>
            {#if editId !== null}
                <button type="button" class="secondary" onclick={resetForm}>
                    Batal
                </button>
            {/if}
        </div>
    </form>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            {#each produk as item (item.id)}
                <tr>
                    <td>{item.id}</td>
                    <td>{item.nama}</td>
                    <td>{item.harga}</td>
                    <td>{item.stok}</td>
                    <td class="actions">
                        <button class="secondary" onclick={() => edit(item)}>
                            Edit
                        </button>
                        <button class="danger" onclick={() => hapus(item.id)}>
                            Hapus
                        </button>
                    </td>
                </tr>
            {:else}
                <tr>
                    <td colspan="5" class="kosong">Belum ada produk</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>

<style>
    main {
        max-width: 640px;
        margin: 2rem auto;
        padding: 0 1rem;
        font-family: system-ui, sans-serif;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    h2 {
        margin: 0;
        font-size: 1.1rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 0.45rem 0.9rem;
        border: none;
        border-radius: 4px;
        background: #2563eb;
        color: white;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    button.secondary {
        background: #6b7280;
    }

    button.danger {
        background: #dc2626;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
        text-align: left;
    }

    .kosong {
        text-align: center;
        color: #888;
    }

    .error {
        padding: 0.6rem 0.8rem;
        background: #fee2e2;
        color: #991b1b;
        border-radius: 4px;
    }
</style>
