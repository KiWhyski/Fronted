<script>
import CareGuideItem from "@/inventory-management/components/care-guide-item.component.vue";

export default {
  name: "care-guide-list",
  /**
   * Props definition
   * @property {Array} guides - List of care guides to display
   */
  props: {
    guides: Array
  },
  components: {
    CareGuideItem
  }
}
</script>

<template>
  <!--
    Table displaying the list of care guides.
    Each row is rendered using the CareGuideItem component.
    Emits 'view-detail' and 'edit' events to the parent component.
  -->
  <table class="guide-table">
    <thead>
    <tr>
      <th>Title</th>
      <th>Product Name</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <care-guide-item
        v-for="item in guides"
        :key="item.id"
        :guide="item"
        @view-detail="$emit('view-detail', $event)"
        @edit="$emit('edit', $event)"
    />
    </tbody>
  </table>
</template>

<style scoped>
.guide-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(110, 0, 129, 0.08);
  overflow: hidden;
}

.guide-table th {
  background: #f3e6fa;
  color: #4b006e;
  font-weight: bold;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e0c8f7;
}

.guide-table td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f3e6fa;
}

.guide-table tr {
  transition: background 0.2s;
}

.guide-table tr:hover {
  background: #f7f0fa;
}

.guide-title {
  color: #6E0081;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}

.guide-title:hover {
  color: #4b006e;
}

.btn.edit {
  background-color: #6E0081;
  color: white;
  padding: 0.4rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(110, 0, 129, 0.08);
}

.btn.edit:hover {
  background-color: #4b006e;
  box-shadow: 0 4px 16px rgba(110, 0, 129, 0.15);
}
</style>