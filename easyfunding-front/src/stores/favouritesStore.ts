import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { noticesPt2030Service } from "@/modules/notices-pt2030/services/noticesPt2030.services";

export const useFavouritesStore = defineStore("favourites", () => {
  const codes = ref<Set<string>>(new Set());
  const loading = ref(false);
  const loaded = ref(false);

  const count = computed(() => codes.value.size);

  async function load() {
    if (loaded.value) return;
    loading.value = true;
    try {
      const list = await noticesPt2030Service.fetchFavourites();
      codes.value = new Set(list);
      loaded.value = true;
    } catch {
      // silently fail — user just won't see favourites
    } finally {
      loading.value = false;
    }
  }

  async function toggle(code: string) {
    const wasFavourite = codes.value.has(code);
    // optimistic update
    if (wasFavourite) {
      codes.value.delete(code);
    } else {
      codes.value.add(code);
    }
    codes.value = new Set(codes.value);

    try {
      await noticesPt2030Service.toggleFavourite(code);
    } catch {
      // revert
      if (wasFavourite) {
        codes.value.add(code);
      } else {
        codes.value.delete(code);
      }
      codes.value = new Set(codes.value);
    }
  }

  function isFavourite(code: string): boolean {
    return codes.value.has(code);
  }

  return { codes, loading, loaded, count, load, toggle, isFavourite };
});
