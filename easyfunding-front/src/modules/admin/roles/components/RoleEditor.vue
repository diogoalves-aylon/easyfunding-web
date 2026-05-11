<script setup lang="ts">
import type { AppRoutePermission, Role, User } from "../adminRoles.types";
import RolePermissionsGrid from "./RolePermissionsGrid.vue";
import RoleUsersTable from "../components/RoleUsersTable.vue";

defineProps<{
  isCreating: boolean;
  selectedRole: Role | null;
  routes: AppRoutePermission[];
  editForm: { id: any; name: string; description: string; permissions: string[] };
  usersInRole: User[];
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "delete"): void;
  (e: "togglePermission", routeName: string): void;
  (e: "openAssignUser"): void;
  (e: "removeUser", userId: number): void;
}>();
</script>

<template>
  <!-- Header -->
  <div class="p-6 ui-border bg-black/5 dark:bg-white/10 flex items-center justify-between">
    <div>
      <h2 class="text-lg font-extrabold text-theme-text">
        {{ isCreating ? "New Role" : "Edit Role" }}
      </h2>

      <span v-if="!isCreating" class="text-xs font-mono text-theme-muted">
        ID: {{ selectedRole?.id }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <!-- Delete -->
      <button
        v-if="!isCreating && !selectedRole?.isSystem"
        type="button"
        @click="emit('delete')"
        class="p-2 rounded-lg transition hover:brightness-110 ui-border bg-red-500/10 text-red-500"
        title="Delete Role"
      >
        <AppIcon name="Trash2" :size="20" className="text-red-500" />
      </button>

      <!-- Save -->
      <button
        type="button"
        @click="emit('save')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition hover:brightness-110 bg-theme-button text-theme-textSecondary"
      >
        <AppIcon name="Save" :size="16" className="text-theme-textSecondary" />
        Save Changes
      </button>
    </div>
  </div>

  <!-- Body -->
  <div class="flex-1 overflow-y-auto p-6 space-y-8">
    <!-- Basic Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-bold text-theme-muted">Role Name</label>
        <input
          v-model="editForm.name"
          type="text"
          placeholder="e.g. Editor"
          class="w-full px-4 py-2 rounded-lg text-sm outline-none ui-border bg-theme-bg shadow text-theme-text placeholder:text-theme-muted/70"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-bold text-theme-muted">Description</label>
        <input
          v-model="editForm.description"
          type="text"
          placeholder="Role description..."
          class="w-full px-4 py-2 rounded-lg text-sm outline-none ui-border bg-theme-bg shadow text-theme-text placeholder:text-theme-muted/70"
        />
      </div>
    </div>

    <!-- Permissions -->
    <div>
      <h3 class="text-sm font-extrabold uppercase tracking-widest mb-4 flex items-center gap-2 text-theme-text">
        <AppIcon name="Shield" :size="16" className=" text-theme-text" />
        Route Permissions
      </h3>

      <RolePermissionsGrid
        :routes="routes"
        :selected="editForm.permissions"
        @toggle="emit('togglePermission', $event)"
      />
    </div>

    <!-- Users -->
    <div v-if="!isCreating">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2 text-theme-text">
          <AppIcon name="UserPlus" :size="16" className="text-theme-text" />
          Assigned Users
        </h3>

        <button
          type="button"
          @click="emit('openAssignUser')"
          class="text-xs px-3 py-1.5 rounded-md font-bold transition hover:brightness-105 ui-border bg-theme-button text-theme-textSecondary"
        >
          + Add User
        </button>
      </div>

      <RoleUsersTable :users="usersInRole" @remove="emit('removeUser', $event)" />
    </div>
  </div>
</template>
