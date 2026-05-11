<script setup lang="ts">
import { useAdminUsers } from "../useAdminUsers";

import UsersHeader from "../components/UsersHeader.vue";
import UsersTable from "../components/UsersTable.vue";
import CreateUserModal from "../components/CreateUserModal.vue";
import DeleteUserModal from "../components/DeleteUserModal.vue";
import EditUserModal from "../components/EditUserModal.vue";

const {
  users,
  roles,
  extraRoles,
  totalUsers,
  loading,

  showDeleteModal,
  showCreateModal,
  showEditModal,

  userToDelete,

  newUser,
  editUser,

  updateUserRole,
  openDelete,
  confirmDelete,
  openCreate,
  closeCreateAndReset,
  createUser,

  openEdit,
  closeEditAndReset,
  updateUser,
} = useAdminUsers();
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl ui-border bg-theme-surface shadow-xl">
      <UsersHeader :total="totalUsers" @create="openCreate" />

      <UsersTable
        :users="users"
        :roles="roles"
        :extraRoles="extraRoles"
        @changeRole="({ user, role }) => updateUserRole(user, role)"
        @delete="openDelete"
        @edit="openEdit"
      />
    </div>

    <DeleteUserModal
      :open="showDeleteModal"
      :user="userToDelete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <CreateUserModal
      :open="showCreateModal"
      :modelValue="newUser"
      :loading="loading"
      @close="closeCreateAndReset"
      @submit="createUser"
      @update:modelValue="v => (newUser = v as any)"
    />

    <EditUserModal
      :open="showEditModal"
      :modelValue="editUser"
      :loading="loading"
      @close="closeEditAndReset"
      @submit="updateUser"
      @update:modelValue="v => (editUser = v as any)"
    />
  </div>
</template>
