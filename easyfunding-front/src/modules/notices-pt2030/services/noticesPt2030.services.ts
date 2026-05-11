import { noticesPt2030Api } from "../noticesPt2030.api";
import type { Portugal2030Notice, NoticeDetailResponse, NoticeStatus } from "../noticesPt2030.types";

export type ParsedDocument = {
  path: string;
  filename: string;
};

export function parseDocuments(documents: string): ParsedDocument[] {
  if (!documents) return [];
  return documents
    .split("; ")
    .filter(Boolean)
    .map((entry) => {
      const [rawPath, rawFilename] = entry.split("&filename=");
      return {
        path: decodeURIComponent(rawPath ?? ""),
        filename: decodeURIComponent((rawFilename ?? "").replace(/\+/g, " ")).replace(/\.$/, "").trim(),
      };
    })
    .filter((doc) => doc.filename);
}

export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  if (num === 0) return "—";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getDownloadUrl(path: string, filename: string): string {
  const u = new URL(
    `https://portugal2030.pt/wp-json/avisos/download?container=siag-prod-container&path=avisos%2F${encodeURIComponent(path)}&filename=${encodeURIComponent(filename)}`
  );
  return u.toString();
}

export function getNoticeStatus(notice: Portugal2030Notice): NoticeStatus {
  const now = Date.now();
  const start = new Date(notice.notice_start_date).getTime();
  const end = new Date(notice.notice_end_date).getTime();

  if (now < start) return "upcoming";
  if (now > end) return "closed";
  return "open";
}

export const noticesPt2030Service = {
  async fetchAll(): Promise<Portugal2030Notice[]> {
    return noticesPt2030Api.list();
  },

  async fetchDetail(code: string): Promise<NoticeDetailResponse> {
    return noticesPt2030Api.detail(code);
  },

  async fetchFavourites(): Promise<string[]> {
    return noticesPt2030Api.getFavourites();
  },

  async toggleFavourite(code: string): Promise<{ is_favourite: boolean }> {
    return noticesPt2030Api.toggleFavourite(code);
  },
};
