<script setup lang="ts">
import { useProfile } from '../useProfile'
import ProfileHeader from '../components/ProfileHeader.vue'
import ProfileCard from '../components/ProfileCard.vue'
import ProfileForm from '../components/ProfileForm.vue'
import SecurityCard from '../components/SecurityCard.vue'
import DangerZoneCard from '../components/DangerZoneCard.vue'

import { ref, watch, computed } from 'vue'
import type { ProfileForm as ProfileFormType, PasswordForm } from '../profile.types'
import { profileService, toProfileForm } from '../services/profile.services'
import { validatePasswordForm } from '../services/profile.services'
import { toast } from 'vue3-toastify'

const { profile, loading, saveProfile } = useProfile()

const form = ref<ProfileFormType>({ name: '', email: '', phone: '' })

const profileError = ref('')
const profileSuccess = ref('')

const passwordErrors = ref<Partial<Record<keyof PasswordForm, string>>>({})

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const savingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const user = computed(() => profile.value)
const initials = computed(() => {
  const name = profile.value?.name ?? ''
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0]!)
    .join('')
    .toUpperCase()
})

watch(
  profile,
  (u) => {
    if (!u) return
    form.value = toProfileForm(u)
  },
  { immediate: true }
)

async function onSaveProfile() {
  profileError.value = ''
  profileSuccess.value = ''

  try {
    await saveProfile(form.value)
  } catch (e: any) {
    profileError.value =
      e?.response?.data?.detail ||
      'Não foi possível salvar suas alterações.'
  }
}

async function changePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  const msg = validatePasswordForm(passwordForm.value)

  if (msg) {
    passwordError.value = msg
    toast.error(msg)
    return
  }

  savingPassword.value = true
  try {
    await profileService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    passwordSuccess.value = 'Senha alterada com sucesso.'
    toast.success(passwordSuccess.value)
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e: any) {
    passwordError.value = e?.response?.data?.detail || 'Não foi possível alterar a senha.'
    toast.error(passwordError.value)
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <ProfileHeader />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <ProfileCard v-if="user" :user="user" :initials="initials" />
        <DangerZoneCard />
      </div>

      <div class="lg:col-span-2 space-y-6">
        <ProfileForm
          v-model="form"
          :loading="loading"
          :error="profileError"
          :success="profileSuccess"
          :lockNameEmail="true"
          @save="onSaveProfile"
        />

        <SecurityCard
          v-model="passwordForm"
          :loading="savingPassword"
          :error="passwordError"
          :success="passwordSuccess"
          @save="changePassword"
        />
      </div>
    </div>
  </div>
</template>
