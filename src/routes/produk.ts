import { Elysia, t } from "elysia";
import { db } from "../db/index";
import { produkTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const produkRoute = new Elysia({
    prefix: "/produk"
});

// Validasi body (nama field harus sama dengan kolom di schema.ts)
const produkBody = t.Object({
    namaBarang: t.String({ minLength: 1 }),
    harga: t.Number({ minimum: 0 }),
    stok: t.Number({ minimum: 0 }),
});

const idParams = t.Object({
    id: t.Numeric(),
});

// 1. Create produk
produkRoute.post(
    "/",
    async ({ body, set }) => {
        const [data] = await db
            .insert(produkTable)
            .values(body)
            .returning();

        set.status = 201;
        return data;
    },
    { body: produkBody }
);

// 2. Read produk (semua)
produkRoute.get("/", async () => {
    const data = await db.select().from(produkTable);
    return data;
});

// 2. Read produk (by id)
produkRoute.get(
    "/:id",
    async ({ params, set }) => {
        const [data] = await db
            .select()
            .from(produkTable)
            .where(eq(produkTable.id, params.id));

        if (!data) {
            set.status = 404;
            return { message: "Produk tidak ditemukan" };
        }

        return data;
    },
    { params: idParams }
);

// 3. Update produk
produkRoute.put(
    "/:id",
    async ({ params, body, set }) => {
        const [data] = await db
            .update(produkTable)
            .set(body)
            .where(eq(produkTable.id, params.id))
            .returning();

        if (!data) {
            set.status = 404;
            return { message: "Produk tidak ditemukan" };
        }

        return data;
    },
    {
        params: idParams,
        body: t.Partial(produkBody), // field boleh dikirim sebagian
    }
);

// 4. Delete produk
produkRoute.delete(
    "/:id",
    async ({ params, set }) => {
        const [data] = await db
            .delete(produkTable)
            .where(eq(produkTable.id, params.id))
            .returning();

        if (!data) {
            set.status = 404;
            return { message: "Produk tidak ditemukan" };
        }

        return { message: "Produk berhasil dihapus", data };
    },
    { params: idParams }
);
