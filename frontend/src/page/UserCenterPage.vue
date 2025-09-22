<template>
  <div class="user-center">
    <UserInfoSection />
    <PrivacySettingSection />
    <TeamInfoSection />
    <TestHistorySection />
  </div>
</template>

<script>
import UserInfoSection from '../section/UserCenterPage/UserInfoSection.vue'
import TeamInfoSection from '../section/UserCenterPage/TeamInfoSection.vue'
import TestHistorySection from '../section/UserCenterPage/TestHistorySection.vue'
import PrivacySettingSection from '@/section/UserCenterPage/PrivacySettingSection.vue';

export default {
  name: 'UserCenterPage',
  components: {
    UserInfoSection,
    TeamInfoSection,
    TestHistorySection,
    PrivacySettingSection
  }
}
</script>

<style scoped>
.user-center {
  min-height: 90vh;
}
</style>
