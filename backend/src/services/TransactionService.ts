import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type FetchParams = { q?: string; page: number; pageSize: number };

function normalize(item: any) {
  return {
    id: String(item.id ?? item.transactionId ?? ""),
    sender: String(item.sender ?? item.senderName ?? ""),
    receiver: String(item.receiver ?? item.receiverName ?? ""),
    amount: Number(item.amount ?? 0),
    currency: String(item.currency ?? "ETB"),
    cause: item.cause ?? item.reason ?? null,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

export const TransactionService = {
  async fetchTransactions({ q, page, pageSize }: FetchParams) {
    const base = process.env.YAYA_BASE_URL || "https://sandbox.yayawallet.com";

    const headers: any = {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.YAYA_API_KEY || "",
      "X-API-SECRET": process.env.YAYA_API_SECRET || "",
    };

    let items: any[] = [];
    let total = 0;

    if (q && q.length > 0) {
      const resp = await fetch(`${base}/transaction/search`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: q }),
      });
      if (!resp.ok)
        throw { status: resp.status, message: "YaYa search failed" };
      const data: any = await resp.json();
      const list = Array.isArray(data?.transactions || data?.data)
        ? data.transactions || data.data
        : [];
      items = list;
      total = list.length;
    } else {
      const resp = await fetch(`${base}/transaction/find-by-user`, { headers });
      if (!resp.ok) throw { status: resp.status, message: "YaYa fetch failed" };
      const data: any = await resp.json();
      const list = Array.isArray(data?.transactions || data?.data)
        ? data.transactions || data.data
        : [];
      items = list;
      total = list.length;
    }

    const normalized = items.map(normalize);

    await Promise.all(
      normalized.map((t) =>
        prisma.transactionCache.upsert({
          where: { id: t.id },
          create: {
            id: t.id,
            sender: t.sender,
            receiver: t.receiver,
            amount: t.amount,
            currency: t.currency,
            cause: t.cause || null,
            createdAt: new Date(t.createdAt),
          },
          update: {
            sender: t.sender,
            receiver: t.receiver,
            amount: t.amount,
            currency: t.currency,
            cause: t.cause || null,
            createdAt: new Date(t.createdAt),
          },
        })
      )
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paged = normalized.slice(start, end);

    return { items: paged, page, pageSize, total };
  },
};
