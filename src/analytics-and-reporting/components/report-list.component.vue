<script>
import ReportItem from "@/analytics-and-reporting/components/report-item.component.vue";

export default {
  name: "report-list",
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  components: {
    ReportItem
  },
  emits: ['edit', 'delete']
}
</script>

<template>
  <div class="report-list-container">
    <table class="report-table">
      <thead>
      <tr>
        <th>Product</th>
        <th>Type</th>
        <th>Unit Price</th>
        <th>Quantity</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <report-item
          v-for="report in reports"
          :key="report.id"
          :report="report"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
      />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.report-list-container {
  margin-top: 1.5rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.report-table th {
  text-align: left;
  font-weight: bold;
  color: #333;
  background-color: #f8f9fa;
  font-size: 0.95rem;
}

.report-table td:nth-child(3),
.report-table td:nth-child(4),
.report-table td:nth-child(5),
.report-table td:nth-child(6) {
  text-align: center;
}

.report-table td {
  font-size: 0.95rem;
  color: #444;
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}
</style>