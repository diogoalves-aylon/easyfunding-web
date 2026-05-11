<script setup lang="ts">
import { useUiConfirm } from "@/shared/composables/useUiConfirm";
import AppIcon from "@/shared/components/AppIcon.vue";
import { useProfile } from "../useProfile";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore'

const { ask } = useUiConfirm();
const { deleteAccount } = useProfile();
const isDeleting = ref(false);
const authStore = useAuthStore()

function onDeleteAccount(e: MouseEvent) {
  ask({
    target: e.currentTarget,
    header: "Excluir conta",
    message: "Essa ação é permanente e não pode ser desfeita.",
    acceptLabel: "Excluir",
    rejectLabel: "Cancelar",
    variant: "danger",
    icon: "pi pi-exclamation-triangle",
    onAccept: () => {
      deleteMyAccount()
    },
  });
}

async function deleteMyAccount(){
  if (isDeleting.value) return;
  isDeleting.value = true;

  try{
    await deleteAccount()

    toast.success('Conta excluída com sucesso!')

    localStorage.removeItem("access")
    localStorage.removeItem("refresh")

    if(authStore.isAuthenticated){
        authStore.logout()
    }
  }catch (e: any){
    const msg = e?.response?.data?.detail ||
                e?.message || "Erro ao deletar conta";

    toast.error(msg)
  }finally{
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="rounded-3xl p-6 ui-border shadow-sm" style="background: var(--surface-theme);">
    <div class="flex items-center gap-2 mb-2">
      <AppIcon name="AlertTriangle" :size="18" className="text-red-500" />
      <h3 class="font-extrabold text-red-500">Zona de Perigo</h3>
    </div>

    <p class="text-sm" style="color: var(--muted-theme);">
      Ações sensíveis da conta. (Você pode ativar isso depois com confirmação.)
    </p>

    <div class="mt-4">
      <button
        type="button"
        @click="onDeleteAccount"
        class="px-5 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase transition active:scale-[0.98]"
        style="background: rgba(239,68,68,0.12); color: rgb(239,68,68);"
      >
        Excluir Conta
      </button>
    </div>
  </div>
</template>
