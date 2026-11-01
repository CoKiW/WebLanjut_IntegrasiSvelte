import { Elysia, t } from "elysia";

const mahasiswa = [
    {
        id: 1,
        nama: "Ahmad",
        email: "ahmad@example.com",
        jurusan: "Teknik Informatika"
    },
    {
        id: 2,
        nama: "Anisa",
        email: "anisa@example.com",
        jurusan: "Manajemen Informatika"
    },
    {
        id: 3,
        nama: "Andika",
        email: "andika@example.com",
        jurusan: "Teknik Informatika"
    }
];

// Validasi body
const mahasiswaBody = t.Object({
    nama: t.String({ minLength: 1 }),
    email: t.String({ format: "email" }),
    jurusan: t.String({ minLength: 1 }),
});

const idParams = t.Object({
    id: t.Numeric(),
});

export const mahasiswaRoute = new Elysia({
    prefix: "/mahasiswa"
});

mahasiswaRoute.get("/:id", ({ params }) => {
    const mahasiswaId = params.id;
    const data = mahasiswa.find(m => m.id === parseInt(mahasiswaId));
    if (data) {
        return data;
    } else {
        return { error: "Mahasiswa tidak ditemukan" };
    }
});

mahasiswaRoute.post("/", ({ params, body }) => {
    if (body) {
        return body;
    } else {
        return { error: "Tidak ada data yang masuk" };
    }
});

// PUT: ganti seluruh data mahasiswa (semua field wajib dikirim)
mahasiswaRoute.put(
    "/:id",
    ({ params, body, set }) => {
        const index = mahasiswa.findIndex(m => m.id === params.id);

        if (index === -1) {
            set.status = 404;
            return { error: "Mahasiswa tidak ditemukan" };
        }

        mahasiswa[index] = { id: params.id, ...body };
        return mahasiswa[index];
    },
    { params: idParams, body: mahasiswaBody }
);

// PATCH: ubah sebagian field saja
mahasiswaRoute.patch(
    "/:id",
    ({ params, body, set }) => {
        const index = mahasiswa.findIndex(m => m.id === params.id);

        if (index === -1) {
            set.status = 404;
            return { error: "Mahasiswa tidak ditemukan" };
        }

        mahasiswa[index] = { ...mahasiswa[index], ...body };
        return mahasiswa[index];
    },
    { params: idParams, body: t.Partial(mahasiswaBody) }
);

// DELETE: hapus mahasiswa
mahasiswaRoute.delete(
    "/:id",
    ({ params, set }) => {
        const index = mahasiswa.findIndex(m => m.id === params.id);

        if (index === -1) {
            set.status = 404;
            return { error: "Mahasiswa tidak ditemukan" };
        }

        const [dihapus] = mahasiswa.splice(index, 1);
        return { message: "Mahasiswa berhasil dihapus", data: dihapus };
    },
    { params: idParams }
);

// CONNECT: contoh sederhana, mengonfirmasi resource tersedia
mahasiswaRoute.connect(
    "/:id",
    ({ params, set }) => {
        const data = mahasiswa.find(m => m.id === params.id);

        if (!data) {
            set.status = 404;
            return { error: "Mahasiswa tidak ditemukan" };
        }

        return { message: `Koneksi ke mahasiswa ${data.nama} berhasil` };
    },
    { params: idParams }
);
