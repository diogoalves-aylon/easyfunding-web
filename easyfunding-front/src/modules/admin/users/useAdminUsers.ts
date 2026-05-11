import { computed, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { adminUsersService } from "../users/services/adminUsers.services";
import type { AdminUser, Role, CreateUserPayload } from "./adminUsers.types";

export type UpdateUserPayload = {
  id: number;
  username: string;
  email: string;
  password?: string; // opcional
  is_admin: boolean;
};

export function useAdminUsers() {
  const users = ref<AdminUser[]>([]);
  const roles = ref<Role[]>([]);
  const loading = ref(true);

  // modais
  const showDeleteModal = ref(false);
  const showCreateModal = ref(false);
  const showEditModal = ref(false);
  const userToDelete = ref<AdminUser | null>(null);

  // formulário
  const newUser = ref<CreateUserPayload>({
    username: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const totalUsers = computed(() => users.value.length);

  const extraRoles = computed(() =>
    roles.value.filter((r) => r.name !== "ADMIN" && r.name !== "USER"),
  );

  let editUser = ref<UpdateUserPayload>({
    id: 0,
    username: "",
    email: "",
    password: "",
    is_admin: false,
  });

  function openEdit(user: AdminUser) {
    editUser.value = {
      id: user.id as number,
      username: user.name, // se no teu type for user.username, troca aqui
      email: user.email,
      password: "",
      is_admin: user.role === "ADMIN",
    };
    showEditModal.value = true;
  }

  function closeEditAndReset() {
    showEditModal.value = false;
    editUser.value = {
      id: 0,
      username: "",
      email: "",
      password: "",
      is_admin: false,
    };
  }

  async function updateUser() {
    loading.value = true;

    try {
      const payload: UpdateUserPayload = {
        ...editUser.value,
        password: editUser.value.password?.trim()
          ? editUser.value.password
          : undefined,
      };
      await adminUsersService.updateUser(payload.id, payload);

      await fetchAll();
      toast.success("Usuário atualizado com sucesso");
      showEditModal.value = false;
    } catch(e: any){
      toast.error("Erro ao atualizar usuário");
    }finally {
      loading.value = false;
    }
  }

  async function fetchAll() {
    loading.value = true;
    try {
      const [usersData, rolesData] = await Promise.all([
        adminUsersService.getUsers(),
        adminUsersService.getRoles(),
      ]);
      users.value = usersData;
      roles.value = rolesData;
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      loading.value = false;
    }
  }

  async function updateUserRole(user: AdminUser, newRole: string) {
    const oldRole = user.role;
    user.role = newRole;
    try {
      await adminUsersService.updateUserRole(user.id, newRole);
      toast.success(`Permissões de ${user.name} atualizadas para ${newRole}`);
    } catch {
      user.role = oldRole;
      toast.error("Falha ao atualizar permissões");
    }
  }

  function openDelete(user: AdminUser) {
    userToDelete.value = user;
    showDeleteModal.value = true;
  }

  async function confirmDelete() {
    if (!userToDelete.value) return;
    try {
      await adminUsersService.deleteUser(userToDelete.value.id);
      users.value = users.value.filter((u) => u.id !== userToDelete.value?.id);
      toast.success("Usuário removido com sucesso");
      showDeleteModal.value = false;
      userToDelete.value = null;
    } catch {
      toast.error("Erro ao remover usuário");
    }
  }

  function openCreate() {
    showCreateModal.value = true;
  }

  function closeCreateAndReset() {
    showCreateModal.value = false;
    newUser.value = { username: "", email: "", password: "", is_admin: false };
  }

  async function createUser() {
    loading.value = true;
    try {
      await adminUsersService.createUser(newUser.value);
      toast.success("Usuário criado com sucesso");
      closeCreateAndReset();
      await fetchAll();
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.username?.[0] ||
        "Erro ao criar usuário";
      toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchAll);

  return {
    // state
    users,
    roles,
    extraRoles,
    totalUsers,
    loading,

    // modals
    showDeleteModal,
    showCreateModal,
    userToDelete,
    showEditModal,

    // form
    newUser,
    editUser,

    // actions
    fetchAll,
    updateUserRole,
    openDelete,
    confirmDelete,
    openCreate,
    closeCreateAndReset,
    createUser,
    openEdit,
    closeEditAndReset,
    updateUser,
  };
}
