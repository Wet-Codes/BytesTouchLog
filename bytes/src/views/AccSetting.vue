<template>
  <PageHeader/>
  <div class="settings-container">
    <h2>Account Settings</h2>
    
    <form @submit.prevent="updateAccount">
      <label>Username:
        <input v-model="currentUser.username">
      </label>
      
      <label>New Password:
        <input v-model="passwordChange.newPassword" type="password">
      </label>
      
      <label>Current Password (to confirm changes):
        <input v-model="passwordChange.currentPassword" type="password">
      </label>
      
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>