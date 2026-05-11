import api from "@/core/api";
import type { Portugal2030Notice, NoticeDetailResponse, NoticeFavouriteToggleResponse } from "./noticesPt2030.types";

export const noticesPt2030Api = {
  async list(): Promise<Portugal2030Notice[]> {
    const res = await api.get<Portugal2030Notice[]>("/api/notices-pt2030/");
    return res.data;
  },

  async detail(code: string): Promise<NoticeDetailResponse> {
    const res = await api.get<NoticeDetailResponse>(`/api/notices-pt2030/${code}/`);
    return res.data;
  },

  async getFavourites(): Promise<string[]> {
    const res = await api.get<string[]>("/api/notices-pt2030/favourites/");
    return res.data;
  },

  async toggleFavourite(code: string): Promise<NoticeFavouriteToggleResponse> {
    const res = await api.post<NoticeFavouriteToggleResponse>("/api/notices-pt2030/favourites/toggle/", { notice_code: code });
    return res.data;
  },
};
