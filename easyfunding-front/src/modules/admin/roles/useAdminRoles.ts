import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { adminRolesService } from '../roles/services/adminRoles.services'
import type { AppRoutePermission, Role, User } from '../roles/adminRoles.types'

export function useAdminRoles() {
  const router = useRouter()

  const routes = computed<AppRoutePermission[]>(() => {
    return router
      .getRoutes()
      .filter(r => r.name && !r.path.includes('*') && r.name !== 'login' && r.name !== 'auth-login' && r.name !== 'not-found')
      .map(r => ({ name: r.name as string, path: r.path, meta: r.meta }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })

  const roles = ref<Role[]>([])
  const users = ref<User[]>([])

  const selectedRole = ref<Role | null>(null)
  const searchQuery = ref('')
  const isCreating = ref(false)
  const loading = ref(true)

  // Edit form
  const editForm = reactive({
    id: '' as string | number,
    name: '',
    description: '',
    permissions: [] as string[]
  })

  // Assign user modal
  const showUserModal = ref(false)
  const userSearch = ref('')
  const selectedUserToAdd = ref<number | null>(null)

  // Delete role modal
  const showDeleteModal = ref(false)

  const filteredRoles = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return roles.value
    return roles.value.filter(r => r.name.toLowerCase().includes(q))
  })

  const filteredUsers = computed(() => {
    const q = userSearch.value.trim().toLowerCase()
    if (!q) return users.value
    return users.value.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  })

  function getUsersInRole(roleName: string) {
    return users.value.filter(u => u.role === roleName)
  }

  function hydrateForm(role: Role) {
    Object.assign(editForm, {
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: role.permissions ? [...role.permissions] : []
    })
  }

  function selectRole(role: Role) {
    selectedRole.value = role
    isCreating.value = false
    hydrateForm(role)
  }

  function createNewRole() {
    isCreating.value = true
    selectedRole.value = null
    Object.assign(editForm, { id: '', name: '', description: '', permissions: [] as string[] })
  }

  function togglePermission(routeName: string) {
    const idx = editForm.permissions.indexOf(routeName)
    if (idx === -1) editForm.permissions.push(routeName)
    else editForm.permissions.splice(idx, 1)
  }

  async function reloadData() {
    loading.value = true
    try {
      const [rolesData, usersData] = await Promise.all([
        adminRolesService.getRoles(),
        adminRolesService.getUsers()
      ])
      roles.value = rolesData
      users.value = usersData

      // restore selection
      if (selectedRole.value) {
        const found = roles.value.find(r => r.id === selectedRole.value?.id)
        if (found) selectRole(found)
        else if (roles.value.length) selectRole(roles.value[0]!)
        else selectedRole.value = null
      } else if (roles.value.length && !isCreating.value) {
        selectRole(roles.value[0]!)
      }
    } catch (e: any) {
      toast.error('Falha ao carregar dados')
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function saveRole() {
    if (!editForm.name?.trim()) {
      toast.error('Nome da role é obrigatório')
      return
    }

    const payload: Role = {
      id: editForm.id,
      name: editForm.name.trim(),
      description: editForm.description?.trim(),
      permissions: [...editForm.permissions],
      isSystem: selectedRole.value?.isSystem
    }

    try {
      const saved = await adminRolesService.saveRole(payload)
      toast.success('Role salva com sucesso')
      await reloadData()
      const found = roles.value.find(r => r.name === saved.name)
      if (found) selectRole(found)
    } catch (e: any) {
      toast.error('Falha ao salvar role')
      console.error(e)
    }
  }

  function requestDeleteRole() {
    if (!selectedRole.value || selectedRole.value.isSystem) return
    showDeleteModal.value = true
  }

  async function confirmDeleteRole() {
    if (!selectedRole.value || selectedRole.value.isSystem) return
    try {
      await adminRolesService.deleteRole(selectedRole.value.id)
      toast.success('Role removida')
      selectedRole.value = null
      showDeleteModal.value = false
      await reloadData()
    } catch (e) {
      toast.error('Falha ao remover role')
    }
  }

  function openAssignUser() {
    if (!selectedRole.value) return
    showUserModal.value = true
    userSearch.value = ''
    selectedUserToAdd.value = null
  }

  async function assignUser() {
    if (!selectedRole.value || !selectedUserToAdd.value) return
    try {
      await adminRolesService.assignRoleToUser(selectedUserToAdd.value, selectedRole.value.name)
      toast.success('Usuário atribuído à role')
      showUserModal.value = false
      selectedUserToAdd.value = null
      await reloadData()
    } catch (e) {
      toast.error('Falha ao atribuir usuário')
    }
  }

  async function removeUserFromRole(userId: number) {
    if (!selectedRole.value) return
    try {
      await adminRolesService.assignRoleToUser(userId, 'USER')
      toast.success('Usuário removido da role')
      await reloadData()
    } catch (e) {
      toast.error('Falha ao remover usuário')
    }
  }

  onMounted(reloadData)

  return {
    // state
    routes,
    roles,
    users,
    selectedRole,
    searchQuery,
    isCreating,
    loading,

    // forms
    editForm,

    // modals
    showUserModal,
    userSearch,
    selectedUserToAdd,
    showDeleteModal,

    // computed
    filteredRoles,
    filteredUsers,

    // helpers/actions
    getUsersInRole,
    selectRole,
    createNewRole,
    togglePermission,
    saveRole,
    requestDeleteRole,
    confirmDeleteRole,
    openAssignUser,
    assignUser,
    removeUserFromRole,
    reloadData
  }
}
