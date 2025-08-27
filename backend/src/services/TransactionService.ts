import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

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

function generateSignature({
  secret,
  timestamp,
  method,
  endpoint,
  body,
}: {
  secret: string;
  timestamp: string;
  method: string;
  endpoint: string;
  body: string;
}) {
  const preHash = timestamp + method.toUpperCase() + endpoint + body;
  return crypto.createHmac("sha256", secret).update(preHash).digest("base64");
}

export const TransactionService = {
  async fetchTransactions({ q, page, pageSize }: FetchParams) {
    const base =
      process.env.YAYA_BASE_URL || "https://sandbox.yayawallet.com/api/en";
    const apiKey = process.env.YAYA_API_KEY!;
    const apiSecret = process.env.YAYA_API_SECRET!;

    const isSearch = q && q.length > 0;
    const endpoint = isSearch
      ? "/transaction/search"
      : "/transaction/find-by-user";
    const method = isSearch ? "POST" : "GET";
    const body = isSearch ? JSON.stringify({ query: q }) : "";

    const timestamp = Date.now().toString();
    const signature = generateSignature({
      secret: apiSecret,
      timestamp,
      method,
      endpoint,
      body,
    });

    const headers: Record<string, string> = {
      "YAYA-API-KEY": apiKey,
      "YAYA-API-TIMESTAMP": timestamp,
      "YAYA-API-SIGN": signature,
    };
    if (isSearch) {
      headers["Content-Type"] = "application/json";
    }

    const resp = await fetch(`${base}${endpoint}`, {
      method,
      headers,
      body: isSearch ? body : undefined,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`YaYa API request failed: ${resp.status} ${text}`);
    }

    const data: any = await resp.json();
    const list = Array.isArray(data?.transactions || data?.data)
      ? data.transactions || data.data
      : [];

    const normalized = list.map(normalize);

    // Cache in Prisma
    await Promise.all(
      normalized.map((t: any) =>
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

    return { items: paged, page, pageSize, total: normalized.length };
  },
};
