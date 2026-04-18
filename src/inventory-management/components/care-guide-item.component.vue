<script>
export default {
  name: "care-guide-item",
  /**
   * Props definition
   * @property {Object} guide - Care guide object to display in the list
   */
  props: {
    guide: Object
  },
}
</script>

<template>
  <!--
    Table row representing a single care guide.
    Emits 'view-detail' and 'edit' events to the parent component.
  -->
  <tr>
    <td>
      <a @click="$emit('view-detail', guide)" class="guide-title">{{ guide.title }}</a>
    </td>
    <td>
      <span>{{ guide.productName }}</span>
    </td>
    <td>
      <button class="btn edit" @click="$emit('edit', guide)">Edit</button>
    </td>
  </tr>
</template>

<style scoped>
.guide-title {
  color: #6E0081;
  cursor: pointer;
  text-decoration: underline;
}
.btn.edit {
  background-color: #5A033A;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>