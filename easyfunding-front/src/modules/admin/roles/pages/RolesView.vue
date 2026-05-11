<script setup lang="ts">
import { useAdminRoles } from '../useAdminRoles'

import RolesHeader from '../components/RolesHeader.vue'
import RolesList from '../components/RolesList.vue'
import RoleEditor from '../components/RoleEditor.vue'
import EmptyState from '../components/EmptyState.vue'
import AssignUserModal from '../components/AssignUserModal.vue'
import DeleteRoleModal from '../components/DeleteRoleModal.vue'

const vm = useAdminRoles()
</script>

<template>
  <div class="h-full flex flex-col gap-6">
    <RolesHeader @create="vm.createNewRole" />

    <div class="flex-1 grid grid-cols-12 gap-6 min-h-0">
      <!-- Sidebar -->
      <div
        class="col-span-12 md:col-span-4 rounded-xl ui-border overflow-hidden flex flex-col bg-theme-surface shadow-xl"
      >
        <RolesList
          :roles="vm.filteredRoles.value"
          :selectedRole="vm.selectedRole.value"
          v-model:search="vm.searchQuery.value"
          @select="vm.selectRole"
        />
      </div>

      <!-- Editor -->
      <div
        v-if="vm.selectedRole || vm.isCreating"
        class="col-span-12 md:col-span-8 rounded-xl ui-border overflow-hidden flex flex-col bg-theme-surface shadow-xl"
      >
        <RoleEditor
            :isCreating="vm.isCreating.value"
            :selectedRole="vm.selectedRole.value"
            :routes="vm.routes.value"
            :editForm="vm.editForm"
            :usersInRole="vm.selectedRole.value
                ? vm.getUsersInRole(vm.selectedRole.value.name)
                : []"
            @save="vm.saveRole"
            @delete="vm.requestDeleteRole"
            @togglePermission="vm.togglePermission"
            @openAssignUser="vm.openAssignUser"
            @removeUser="vm.removeUserFromRole"
        />

      </div>

      <div
        v-else
        class="col-span-12 md:col-span-8"
      >
        <EmptyState />
      </div>
    </div>

    <AssignUserModal
        :open="vm.showUserModal.value"
        :role-name="vm.selectedRole.value?.name ?? ''"
        v-model:search="vm.userSearch.value"
        v-model:selectedUserId="vm.selectedUserToAdd.value"
        :users="vm.filteredUsers.value"
        @close="vm.showUserModal.value = false"
        @confirm="vm.assignUser"
    />


    <DeleteRoleModal
      :open="vm.showDeleteModal.value"
      :role="vm.selectedRole.value"
      @close="vm.showDeleteModal.value = false"
      @confirm="vm.confirmDeleteRole"
    />
  </div>
</template>
