export type Portugal2030Notice = {
  id: number;
  domination: string;
  classification: string;
  code: string;
  fund: string;
  notice_publication_date: string;
  notice_start_date: string;
  notice_end_date: string;
  notice_updated_at: string;
  global_allocation: string;
  national_allocation: string;
  total_allocation: string;
  documents: string;
  type: string;
  created_at: string;
};

export type NoticeDetailResponse = {
  latest: Portugal2030Notice;
  history: Portugal2030Notice[];
};

export type NoticesFilters = {
  search: string;
  type: string;
  fund: string;
  publication_from: string;
  publication_to: string;
};

export type NoticeStatus = "open" | "closed" | "upcoming";

export type NoticeFavouriteToggleResponse = {
  is_favourite: boolean;
};
