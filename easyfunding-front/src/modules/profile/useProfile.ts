import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import type { ProfileForm, PasswordForm, UserProfile } from '../profile/profile.types'
import { profileService } from '../profile/services/profile.services'
import { unmaskPhone } from '@/utils/utils'

export function useProfile() {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)

  async function loadProfile() {
    loading.value = true
    try {
      profile.value = await profileService.getProfile()
    } catch {
      toast.error('Erro ao carregar perfil')
    } finally {
      loading.value = false
    }
  }

  async function saveProfile(form: ProfileForm) {
    try {
      form.phone = unmaskPhone(form.phone)
      await profileService.updateProfile(form)
      toast.success('Perfil atualizado')
      await loadProfile()
    } catch {
      toast.error('Erro ao atualizar perfil')
    }
  }
  

  async function changePassword(form: PasswordForm) {
    try {
      await profileService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      toast.success('Senha alterada com sucesso')
    } catch {
      toast.error('Erro ao alterar senha')
    }
  }

  async function deleteAccount(){
    try{
      await profileService.deleteAccount()
    }catch (e: any){
      throw e;      
    }
  }

  onMounted(loadProfile)

  return {
    profile,
    loading,
    loadProfile,
    saveProfile,
    changePassword,
    deleteAccount
  }
}
