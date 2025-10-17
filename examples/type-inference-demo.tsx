/**
 * Type Inference Demo - Real-World Examples
 *
 * This file demonstrates practical usage of the improved type inference
 * in real-world scenarios.
 */

import React from 'react';
import {
  Column,
  ReusableTable,
  ViewConfiguration,
  TypedViewConfiguration,
  ExtractAccessors,
} from 'advanced-reusable-table';

// ============================================================
// EXAMPLE 1: Simple User Management Table
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  department: string;
  isActive: boolean;
}

// ✅ NO type assertions needed - TypeScript infers everything!
const userColumns: Column<User>[] = [
  { header: 'ID', accessor: 'id', sortable: true, dataType: 'number' },
  { header: 'Name', accessor: 'name', sortable: true, editable: true },
  { header: 'Email', accessor: 'email', sortable: true, filterable: true },
  { header: 'Age', accessor: 'age', sortable: true, dataType: 'number' },
  { header: 'City', accessor: 'city', filterable: true, groupable: true },
  { header: 'Department', accessor: 'department', groupable: true },
  { header: 'Active', accessor: 'isActive', cellType: 'toggle' },
];

const userView: ViewConfiguration<User> = {
  id: 'default',
  name: 'Default View',
  visibleColumns: ['id', 'name', 'email', 'city', 'department'],
  groupBy: ['department'],
  sortConfig: [{ key: 'name', direction: 'ascending' }],
};

export function UserTableDemo() {
  const users: User[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      age: 28,
      city: 'New York',
      department: 'Engineering',
      isActive: true,
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      age: 35,
      city: 'San Francisco',
      department: 'Sales',
      isActive: true,
    },
  ];

  return (
    <ReusableTable
      allColumns={userColumns}
      data={users}
      viewConfig={userView}
    />
  );
}

// ============================================================
// EXAMPLE 2: Type-Safe View with Const Assertions
// ============================================================

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
}

// Using const assertion for maximum type safety
const productColumns = [
  { header: 'Product ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true, editable: true },
  { header: 'Category', accessor: 'category', groupable: true },
  { header: 'Price', accessor: 'price', dataType: 'currency' as const },
  { header: 'Stock', accessor: 'stock', dataType: 'number' as const },
] as const satisfies readonly Column<Product>[];

// Extract accessor types from the column definition
type ProductColumnKeys = ExtractAccessors<Product, typeof productColumns>;
// Result: 'id' | 'name' | 'category' | 'price' | 'stock'

// Type-safe view configuration
const productView: TypedViewConfiguration<Product, typeof productColumns> = {
  id: 'inventory',
  name: 'Inventory View',
  visibleColumns: ['id', 'name', 'category', 'price', 'stock'],
  groupBy: ['category'],
  sortConfig: [{ key: 'name', direction: 'ascending' }],
};

// ❌ TypeScript prevents this - 'supplier' is not in productColumns:
// const invalidView: TypedViewConfiguration<Product, typeof productColumns> = {
//   visibleColumns: ['supplier'], // Error!
// };

export function ProductTableDemo() {
  const products: Product[] = [
    {
      id: 'P001',
      name: 'Laptop',
      category: 'Electronics',
      price: 999.99,
      stock: 50,
      supplier: 'TechSupply Inc',
    },
  ];

  return (
    <ReusableTable
      allColumns={productColumns as any} // Cast needed for readonly array
      data={products}
      viewConfig={productView as any}
    />
  );
}

// ============================================================
// EXAMPLE 3: Dynamic Column Generation
// ============================================================

interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: Date;
  salary: number;
}

// Helper function with full type inference
function createEmployeeColumn<K extends keyof Employee>(
  key: K,
  header: string,
  options?: Partial<Omit<Column<Employee, K>, 'header' | 'accessor'>>
): Column<Employee, K> {
  return {
    header,
    accessor: key,
    sortable: true,
    ...options,
  };
}

// ✅ Full autocomplete when calling createEmployeeColumn
const employeeColumns: Column<Employee>[] = [
  createEmployeeColumn('employeeId', 'Employee ID', {
    filterable: true,
  }),
  createEmployeeColumn('firstName', 'First Name', {
    editable: true,
  }),
  createEmployeeColumn('lastName', 'Last Name', {
    editable: true,
  }),
  createEmployeeColumn('email', 'Email Address', {
    filterable: true,
  }),
  createEmployeeColumn('hireDate', 'Hire Date', {
    dataType: 'date',
    dateOptions: { locale: 'en-US', dateStyle: 'medium' },
  }),
  createEmployeeColumn('salary', 'Salary', {
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
  }),
];

export function EmployeeTableDemo() {
  const employees: Employee[] = [
    {
      employeeId: 'E001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      hireDate: new Date('2020-01-15'),
      salary: 75000,
    },
  ];

  return (
    <ReusableTable
      allColumns={employeeColumns}
      data={employees}
      viewConfig={{
        visibleColumns: [
          'employeeId',
          'firstName',
          'lastName',
          'email',
          'hireDate',
        ],
      }}
    />
  );
}

// ============================================================
// EXAMPLE 4: Complex Column with Custom Rendering
// ============================================================

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
}

const taskColumns: Column<Task>[] = [
  {
    header: 'ID',
    accessor: 'id',
    sortable: true,
  },
  {
    header: 'Title',
    accessor: 'title',
    sortable: true,
    editable: true,
  },
  {
    header: 'Status',
    accessor: 'status',
    cell: (task) => {
      const colors = {
        todo: '#gray',
        'in-progress': '#blue',
        done: '#green',
      };
      return (
        <span style={{ color: colors[task.status] }}>
          {task.status.toUpperCase()}
        </span>
      );
    },
  },
  {
    header: 'Priority',
    accessor: 'priority',
    sortable: true,
    renderCell: (context) => ({
      type: 'custom',
      content: (
        <span
          style={{
            fontWeight: context.value === 'high' ? 'bold' : 'normal',
            color: context.value === 'high' ? 'red' : 'inherit',
          }}
        >
          {context.value}
        </span>
      ),
    }),
  },
  {
    header: 'Assignee',
    accessor: 'assignee',
    filterable: true,
    groupable: true,
  },
  {
    header: 'Due Date',
    accessor: 'dueDate',
    sortable: true,
    dataType: 'date',
    dateOptions: { locale: 'en-US', dateStyle: 'short' },
  },
];

export function TaskTableDemo() {
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Implement feature X',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Alice',
      dueDate: new Date('2024-12-31'),
    },
  ];

  return (
    <ReusableTable
      allColumns={taskColumns}
      data={tasks}
      viewConfig={{
        visibleColumns: ['id', 'title', 'status', 'priority', 'assignee'],
        groupBy: ['status'],
        sortConfig: [{ key: 'priority', direction: 'descending' }],
      }}
    />
  );
}

// ============================================================
// EXAMPLE 5: Multiple Views for Same Data
// ============================================================

const allUserColumns = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Email', accessor: 'email', sortable: true },
  { header: 'Age', accessor: 'age', sortable: true },
  { header: 'City', accessor: 'city', groupable: true },
  { header: 'Department', accessor: 'department', groupable: true },
  { header: 'Active', accessor: 'isActive', cellType: 'toggle' as const },
] as const;

// View 1: Basic information
const basicView: TypedViewConfiguration<User, typeof allUserColumns> = {
  id: 'basic',
  name: 'Basic Info',
  visibleColumns: ['id', 'name', 'email'],
  sortConfig: [{ key: 'name', direction: 'ascending' }],
};

// View 2: By department
const departmentView: TypedViewConfiguration<User, typeof allUserColumns> = {
  id: 'by-department',
  name: 'By Department',
  visibleColumns: ['name', 'email', 'department', 'city'],
  groupBy: ['department'],
  sortConfig: [{ key: 'department', direction: 'ascending' }],
};

// View 3: Active users only (with filter)
const activeUsersView: TypedViewConfiguration<User, typeof allUserColumns> = {
  id: 'active',
  name: 'Active Users',
  visibleColumns: ['id', 'name', 'email', 'department'],
  filterConfig: [
    {
      key: 'isActive',
      value: 'true',
      operator: 'equals',
    },
  ],
};

export { basicView, departmentView, activeUsersView };
