import React from 'react';
import type { Column, CollectionConfig, CollectionOption } from '../types';
import { strict } from 'assert';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  status: 'active' | 'inactive' | 'pending';
  isSubscribed: boolean;
  hireDate: string;
  lastLogin: string;
  // Collection examples
  skills: string[]; // Chip collection
  department: string; // Radio collection
  permissions: string[]; // Checkbox collection
  tags: string[]; // Tag collection
}

export interface Product {
  id: string;
  name: string;
  category: 'Electronics' | 'Books' | 'Clothing' | 'Home Goods';
  price: number;
  stock: number;
  isFeatured: boolean;
  // Collection examples
  categories: string[]; // Multi-category support
  features: string[]; // Product features
}

export interface PayrollRecord {
  Antal: number;
  AnstNr: number; //emp_id
  AttestSignatur?: string; // seems empty in your data
  Belopp: number;
  Namn: string;
  LonArtNr: number;
  Period: string; // e.g. "2025.M.01"
  id: string; // UUID
  Summa: number;
  AntalEnhet: 'mån' | 'tim' | 'dgr' | ''; // only known values (empty also occurs)
  AttestTime?: string; // seems empty
  DigitalMailboxStatusText: 'Ej skickad' | 'Skickad' | 'Mottagen' | string;
  Klarmarkerad: 'Yes' | 'No';
  SumSkatt: number;
}

export interface ProcessPlans {
  Ordning: number; // Order/Priority
  Aktivitet: string; // Activity title
  Aktivitetskommentar?: string | string[] | null; // Dynamic: string comment, array of steps, or empty
  Utföres_senast?: string; // Due date (DatePicker)
  Utfört_av?: string; // Completed by (text input)
  Utfört_datum?: string; // Completion date (DatePicker)
  Status: 'Not Started' | 'In Progress' | 'Completed'; // Radio button collection
}

export const processPlans: ProcessPlans[] = [
  {
    Ordning: 1,
    Aktivitet: 'Stoppdagar - Skicka ut nya Stoppdagar i okt/nov varje år',
    Aktivitetskommentar: 'Simple task - just send annual stop days', // Text comment
    Utföres_senast: '2025-11-15',
    Utfört_av: undefined,
    Utfört_datum: undefined,
    Status: 'Not Started'
  },
  {
    Ordning: 2, 
    Aktivitet: 'CSR förfrågan och hantering',
    Aktivitetskommentar: ['review_requirements', 'prepare_documents', 'stakeholder_approval'], // Collection steps
    Utföres_senast: '2025-12-31',
    Utfört_av: undefined,
    Utfört_datum: undefined,
    Status: 'Not Started'
  },
  {
    Ordning: 3,
    Aktivitet: 'Reserglemente uppdatering',
    Aktivitetskommentar: ['review_requirements', 'implement_changes', 'quality_check'], // Collection steps
    Utföres_senast: '2025-01-15',
    Utfört_av: 'Anna Svensson',
    Utfört_datum: '2024-12-20',
    Status: 'Completed'
  },
  {
    Ordning: 4,
    Aktivitet: 'Upplägg av nya löneperioder',
    Aktivitetskommentar: null, // No comment - will show as "self-explanatory"
    Utföres_senast: '2025-01-01',
    Utfört_av: undefined,
    Utfört_datum: undefined,
    Status: 'In Progress'
  },
  {
    Ordning: 5,
    Aktivitet: 'Inläsning av årsversion',
    Aktivitetskommentar: ['prepare_documents', 'implement_changes', 'deploy_updates', 'monitor_results'], // Complex collection
    Utföres_senast: '2025-01-02',
    Utfört_av: 'Lars Petersson',
    Utfört_datum: '2024-12-28',
    Status: 'Completed'
  },
  {
    Ordning: 6,
    Aktivitet: 'Upplägg av filter',
    Aktivitetskommentar: 'Can be done anytime during the year', // Text comment
    Utföres_senast: '2025-06-30',
    Utfört_av: undefined,
    Utfört_datum: undefined,
    Status: 'Not Started'
  },
  {
    Ordning: 7,
    Aktivitet: 'Utläggning av nya schema',
    Aktivitetskommentar: null, // No comment - self-explanatory
    Utföres_senast: '2025-02-15',
    Utfört_av: 'Maria Lindqvist',
    Utfört_datum: undefined,
    Status: 'In Progress'
  }
];


export const payrollRecords: PayrollRecord[] = [
  { Antal: 0, AnstNr: 77, AttestSignatur: '', Belopp: 0, Namn: 'Eva Johannesson', LonArtNr: 12, Period: '2025.M.01', id: '147857bb-e857-4fca-9e25-8bad818c721c', Summa: 45000, AntalEnhet: 'mån', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -13495 },
  { Antal: 0, AnstNr: 77, AttestSignatur: '', Belopp: 0, Namn: 'Eva Johannesson', LonArtNr: 1250, Period: '2025.M.01', id: '147857bb-e857-4fca-9e25-8bad818c721c', Summa: 5000, AntalEnhet: 'tim', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -13495 },
  { Antal: 0, AnstNr: 77, AttestSignatur: '', Belopp: 0, Namn: 'Eva Johannesson', LonArtNr: 61, Period: '2025.M.01', id: '147857bb-e857-4fca-9e25-8bad818c721c', Summa: -1000, AntalEnhet: '', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -13495 },
  { Antal: 0, AnstNr: 666, AttestSignatur: '', Belopp: 0, Namn: 'Jonas Göransson', LonArtNr: 12, Period: '2025.M.01', id: '150234c5-b528-4892-bdb2-7f4f785b56e6', Summa: 50000, AntalEnhet: 'mån', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -20688 },
  { Antal: 1, AnstNr: 666, AttestSignatur: '', Belopp: 0, Namn: 'Jonas Göransson', LonArtNr: 235, Period: '2025.M.01', id: '150234c5-b528-4892-bdb2-7f4f785b56e6', Summa: 0, AntalEnhet: 'dgr', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -20688 },
  { Antal: 1, AnstNr: 666, AttestSignatur: '', Belopp: -2300, Namn: 'Jonas Göransson', LonArtNr: 226, Period: '2025.M.01', id: '150234c5-b528-4892-bdb2-7f4f785b56e6', Summa: -2300, AntalEnhet: 'dgr', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -20688 },
  { Antal: 0, AnstNr: 666, AttestSignatur: '', Belopp: 0, Namn: 'Jonas Göransson', LonArtNr: 1250, Period: '2025.M.01', id: '150234c5-b528-4892-bdb2-7f4f785b56e6', Summa: 15000, AntalEnhet: 'tim', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -20688 },
  { Antal: 0, AnstNr: 666, AttestSignatur: '', Belopp: 0, Namn: 'Jonas Göransson', LonArtNr: 61, Period: '2025.M.01', id: '150234c5-b528-4892-bdb2-7f4f785b56e6', Summa: -2000, AntalEnhet: '', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -20688 },
  { Antal: 0, AnstNr: 15, AttestSignatur: '', Belopp: 0, Namn: 'Christel Watson-Svensson', LonArtNr: 12, Period: '2025.M.01', id: '18bfe0d3-9967-4a2a-9826-a2157cbf371b', Summa: 216, AntalEnhet: 'mån', AttestTime: '', DigitalMailboxStatusText: 'Skickad', Klarmarkerad: 'Yes', SumSkatt: 0 },
  { Antal: 0, AnstNr: 15, AttestSignatur: '', Belopp: 0, Namn: 'Christel Watson-Svensson', LonArtNr: 12, Period: '2025.M.01', id: '18bfe0d3-9967-4a2a-9826-a2157cbf371b', Summa: 216, AntalEnhet: 'mån', AttestTime: '', DigitalMailboxStatusText: 'Skickad', Klarmarkerad: 'Yes', SumSkatt: 0 },
  { Antal: 0, AnstNr: 84, AttestSignatur: '', Belopp: 0, Namn: 'Sofia Magnusson', LonArtNr: 12, Period: '2025.M.01', id: '1cb99258-b51f-49f3-887e-686d3a361504', Summa: 38000, AntalEnhet: 'mån', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -8683 },
  { Antal: 0, AnstNr: 84, AttestSignatur: '', Belopp: 0, Namn: 'Sofia Magnusson', LonArtNr: 1250, Period: '2025.M.01', id: '1cb99258-b51f-49f3-887e-686d3a361504', Summa: 500, AntalEnhet: 'tim', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -8683 },
  { Antal: 0, AnstNr: 84, AttestSignatur: '', Belopp: 0, Namn: 'Sofia Magnusson', LonArtNr: 91, Period: '2025.M.01', id: '1cb99258-b51f-49f3-887e-686d3a361504', Summa: 0, AntalEnhet: '', AttestTime: '', DigitalMailboxStatusText: 'Ej skickad', Klarmarkerad: 'No', SumSkatt: -8683 },
];


export const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, city: 'New York', status: 'active', isSubscribed: true, hireDate: '2022-01-15', lastLogin: '2024-05-20T10:30:00Z', skills: ['javascript', 'react', 'typescript'], department: 'engineering', permissions: ['read', 'write'], tags: ['senior', 'frontend'] },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 34, city: 'Los Angeles', status: 'inactive', isSubscribed: false, hireDate: '2021-03-20', lastLogin: '2024-05-18T15:00:00Z', skills: ['python', 'django'], department: 'engineering', permissions: ['read'], tags: ['backend'] },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 22, city: 'Chicago', status: 'active', isSubscribed: true, hireDate: '2023-05-10', lastLogin: '2024-05-21T09:00:00Z', skills: ['figma', 'sketch'], department: 'design', permissions: ['read', 'write', 'admin'], tags: ['junior', 'ui-ux'] },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', age: 45, city: 'New York', status: 'pending', isSubscribed: false, hireDate: '2019-11-01', lastLogin: '2024-04-30T12:00:00Z', skills: ['product-management', 'analytics', 'strategy', 'leadership'], department: 'product', permissions: ['read', 'write', 'admin', 'export'], tags: ['senior', 'product-owner'] },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', age: 34, city: 'Miami', status: 'active', isSubscribed: true, hireDate: '2022-08-22', lastLogin: '2024-05-20T11:45:00Z', skills: ['javascript', 'nodejs', 'vue'], department: 'engineering', permissions: ['read', 'write'], tags: ['fullstack'] },
  { id: 6, name: 'Fiona Glenanne', email: 'fiona@example.com', age: 31, city: 'Chicago', status: 'inactive', isSubscribed: true, hireDate: '2021-07-12', lastLogin: '2024-05-01T18:20:00Z', skills: ['marketing', 'copywriting'], department: 'marketing', permissions: ['read'], tags: ['content', 'social-media'] },
  { id: 7, name: 'George Costanza', email: 'george@example.com', age: 52, city: 'New York', status: 'active', isSubscribed: false, hireDate: '2018-02-28', lastLogin: '2024-05-19T08:15:00Z', skills: ['sales', 'negotiation'], department: 'sales', permissions: ['read', 'write'], tags: ['enterprise', 'b2b'] },
  { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', age: 25, city: 'Los Angeles', status: 'active', isSubscribed: true, hireDate: '2023-01-05', lastLogin: '2024-05-21T13:05:00Z', skills: ['customer-service', 'zendesk'], department: 'support', permissions: ['read'], tags: ['junior', 'helpdesk'] },
  { id: 9, name: 'Iris West', email: 'iris@example.com', age: 29, city: 'Central City', status: 'pending', isSubscribed: false, hireDate: '2022-11-30', lastLogin: '2024-05-15T20:00:00Z', skills: ['journalism', 'writing'], department: 'marketing', permissions: ['read', 'write'], tags: ['content-creator'] },
  { id: 10, name: 'Jack Sparrow', email: 'jack@example.com', age: 41, city: 'Tortuga', status: 'inactive', isSubscribed: true, hireDate: '2020-04-18', lastLogin: '2023-12-25T23:59:00Z', skills: ['leadership', 'strategy'], department: 'product', permissions: ['read', 'write', 'admin', 'audit'], tags: ['captain', 'legacy'] },
];

export const products: Product[] = [
  { id: 'p001', name: 'Laptop Pro', category: 'Electronics', price: 1499.99, stock: 45, isFeatured: true, categories: ['electronics', 'computers'], features: ['touchscreen', 'fast-charging', 'lightweight'] },
  { id: 'p002', name: 'The Great Novel', category: 'Books', price: 19.99, stock: 250, isFeatured: false, categories: ['books', 'fiction'], features: ['bestseller', 'hardcover'] },
  { id: 'p003', name: 'Denim Jacket', category: 'Clothing', price: 89.50, stock: 120, isFeatured: true, categories: ['clothing', 'outerwear'], features: ['cotton', 'sustainable', 'classic-fit'] },
  { id: 'p004', name: 'Smart Speaker', category: 'Electronics', price: 99.00, stock: 88, isFeatured: true, categories: ['electronics', 'smart-home'], features: ['voice-control', 'wifi', 'bluetooth'] },
  { id: 'p005', name: 'Coffee Maker', category: 'Home Goods', price: 45.95, stock: 0, isFeatured: false, categories: ['home-goods', 'kitchen'], features: ['programmable', 'auto-shutoff'] },
  { id: 'p006', name: 'Running Shoes', category: 'Clothing', price: 120.00, stock: 300, isFeatured: false, categories: ['clothing', 'footwear', 'athletic'], features: ['breathable', 'cushioned', 'lightweight'] },
  { id: 'p007', name: 'History of the World', category: 'Books', price: 29.99, stock: 50, isFeatured: true, categories: ['books', 'non-fiction', 'education'], features: ['illustrated', 'comprehensive', 'updated-edition'] },
  { id: 'p008', name: 'Wireless Mouse', category: 'Electronics', price: 35.00, stock: 150, isFeatured: false, categories: ['electronics', 'accessories'], features: ['ergonomic', 'long-battery'] },
  { id: 'p009', name: 'Silk Scarf', category: 'Clothing', price: 25.00, stock: 180, isFeatured: true, categories: ['clothing', 'accessories'], features: ['luxury', 'hand-crafted', 'gift-ready'] },
  { id: 'p010', name: 'Blender', category: 'Home Goods', price: 79.99, stock: 60, isFeatured: false, categories: ['home-goods', 'kitchen'], features: ['high-power', 'easy-clean', 'multiple-speeds'] },
];


const GenericPill: React.FC<{ value: string; colorMap: Record<string, string> }> = ({ value, colorMap }) => {
    const colorClass = colorMap[value] || 'bg-gray-500/20 text-gray-300'; // Default color
    return React.createElement('span', {
        className: `px-3 py-1 text-xs font-medium rounded-full ${colorClass}`
    }, value);
};

export const payrollColumns: Column<PayrollRecord>[] = [
  { header: 'ID', accessor: 'id', sortable: true, filterable: true, dataType: 'string', groupable: true },
  { header: 'Name', accessor: 'Namn', sortable: true, filterable: true, dataType: 'string' },
  { header: 'Emp. No', accessor: 'AnstNr', sortable: true, filterable: true, dataType: 'number' },
  { header: 'Period', accessor: 'Period', sortable: true, filterable: true, dataType: 'string', groupable: true },
  { header: 'Salary Code', accessor: 'LonArtNr', sortable: true, filterable: true, dataType: 'number', groupable: true },
  { header: 'Amount', accessor: 'Summa', sortable: true, filterable: true, dataType: 'currency', currencyOptions: { locale: 'sv-SE', currency: 'SEK' }, editable: true },
  { header: 'Quantity', accessor: 'Antal', sortable: true, filterable: true, dataType: 'number', editable: true },
  { header: 'Unit', accessor: 'AntalEnhet', sortable: true, filterable: true, dataType: 'string' },
  { header: 'Gross Amount', accessor: 'Belopp', sortable: true, filterable: true, dataType: 'currency', currencyOptions: { locale: 'sv-SE', currency: 'SEK' }, editable: true },
  { header: 'Tax Amount', accessor: 'SumSkatt', sortable: true, filterable: true, dataType: 'currency', currencyOptions: { locale: 'sv-SE', currency: 'SEK' }, editable: true },
  { header: 'Attested By', accessor: 'AttestSignatur', sortable: true, filterable: true, dataType: 'string' },
  { header: 'Attest Time', accessor: 'AttestTime', sortable: true, filterable: true, dataType: 'string' },
  { 
    header: 'Approved',
    accessor: 'Klarmarkerad',
    sortable: true,
    filterable: true,
    dataType: 'string',
    cell: (item: PayrollRecord) => React.createElement(GenericPill, { 
        value: item.Klarmarkerad,
        colorMap: {
            'Yes': 'bg-green-500/20 text-green-300',
            'No': 'bg-red-500/20 text-red-300',
        }
    }),
    groupable: true,
    align: 'center'
  },
  { 
    header: 'Digital Mail Status',
    accessor: 'DigitalMailboxStatusText',
    sortable: true,
    filterable: true,
    dataType: 'string',
    cell: (item: PayrollRecord) => React.createElement(GenericPill, { 
        value: item.DigitalMailboxStatusText,
        colorMap: {
            'Skickad': 'bg-green-500/20 text-green-300', 
            'Ej skickad': 'bg-red-500/20 text-red-300',
            'Mottagen': 'bg-yellow-500/20 text-yellow-300',
        }
    }),
    groupable: true,
    align: 'center'
  }
];

// ProcessPlans column definitions with comprehensive mixed content dynamic rendering
export const processPlansColumns: Column<ProcessPlans>[] = [
  {
    header: 'Order',
    accessor: 'Ordning',
    dataType: 'number',
    sortable: true,
    filterable: true,
    editable: true,
    align: 'center',
    groupable: true
  },
  {
    header: 'Activity',
    accessor: 'Aktivitet', 
    dataType: 'string',
    sortable: true,
    filterable: true,
    editable: true,
    cell: (item: ProcessPlans) => (
      React.createElement('div', {
        className: 'font-medium text-gray-100'
      }, item.Aktivitet)
    )
  },
  {
    header: 'Activity Comments',
    accessor: 'Aktivitetskommentar',
    renderCell: (context) => {
      const { value, row } = context;
      
      // Array of detailed steps - show as collection
      if (Array.isArray(value) && value.length > 0) {
        return {
          type: 'collection',
          collectionConfig: {
            type: 'checkbox',
            inputMode: 'traditional', // Traditional checkboxes for enterprise feel
            viewDisplayMode: 'traditional', // Traditional checkbox list display
            options: [
              { value: 'review_requirements', label: '📋 Review Requirements' },
              { value: 'prepare_documents', label: '📄 Prepare Documents' },
              { value: 'stakeholder_approval', label: '✅ Get Stakeholder Approval' },
              { value: 'implement_changes', label: '🔧 Implement Changes' },
              { value: 'quality_check', label: '🔍 Quality Check' },
              { value: 'deploy_updates', label: '🚀 Deploy Updates' },
              { value: 'monitor_results', label: '📊 Monitor Results' }
            ],
            maxSelections: 7,
            searchable: true
          } as CollectionConfig,
          editable: row.Status !== 'Completed'
        };
      }
      
      // Simple text comment - show as editable text
      if (typeof value === 'string' && value.trim()) {
        return {
          type: 'text',
          content: (
            React.createElement('div', {
              className: 'text-sm text-blue-200 italic'
            }, `💬 ${value}`)
          ),
          editable: row.Status !== 'Completed'
        };
      }
      
      // No comment - show contextual placeholder based on activity complexity
      const isComplexActivity = row.Aktivitet && (
        row.Aktivitet.includes('CSR') || 
        row.Aktivitet.includes('Reserglemente') ||
        row.Aktivitet.includes('Inläsning')
      );
      
      return {
        type: 'text',
        content: (
          React.createElement('span', {
            className: 'text-gray-500 italic text-sm'
          }, isComplexActivity ? '🔄 Click to add detailed steps' : '✨ Self-explanatory task')
        ),
        editable: row.Status !== 'Completed'
      };
    },
    sortable: false, // Mixed content types
    filterable: true
  },
  {
    header: 'Due Date',
    accessor: 'Utföres_senast',
    dataType: 'date',
    dateOptions: {
      locale: 'sv-SE',
      dateStyle: 'medium'
    },
    sortable: true,
    filterable: true,
    editable: true
  },
  {
    header: 'Completed By',
    accessor: 'Utfört_av',
    dataType: 'string',
    sortable: true,
    filterable: true,
    editable: true,
    cell: (item: ProcessPlans) => item.Utfört_av ? (
      React.createElement('div', {
        className: 'flex items-center gap-2'
      }, [
        React.createElement('div', {
          key: 'avatar',
          className: 'w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold'
        }, item.Utfört_av.charAt(0).toUpperCase()),
        React.createElement('span', {
          key: 'name',
          className: 'text-green-200'
        }, item.Utfört_av)
      ])
    ) : (
      React.createElement('span', {
        className: 'text-gray-500 italic text-sm'
      }, 'Unassigned')
    )
  },
  {
    header: 'Completion Date',
    accessor: 'Utfört_datum',
    dataType: 'date',
    dateOptions: {
      locale: 'sv-SE', 
      dateStyle: 'medium'
    },
    sortable: true,
    filterable: true,
    editable: true,
    // Only editable if status is 'Completed'
    renderCell: (context) => {
      const { value, row } = context;
      return {
        type: 'date',
        editable: row.Status === 'Completed'
      };
    }
  },
  {
    header: 'Status',
    accessor: 'Status',
    dataType: 'collection',
    collectionConfig: {
      type: 'radio',
      inputMode: 'chips', // Modern chip-based radio selection
      viewDisplayMode: 'inline',
      options: [
        { 
          value: 'Not Started', 
          label: 'Not Started',
          color: '#6b7280' // gray
        },
        { 
          value: 'In Progress', 
          label: 'In Progress',
          color: '#3b82f6' // blue
        },
        { 
          value: 'Completed', 
          label: 'Completed',
          color: '#10b981' // green
        }
      ]
    } as CollectionConfig,
    sortable: true,
    filterable: true,
    editable: true,
    groupable: true
  }
];


export const userColumns: Column<User>[] = [
  { header: 'ID', accessor: 'id', sortable: true, filterable: true, dataType: 'number' },
  { header: 'Name', accessor: 'name', sortable: true, filterable: true, dataType: 'string', editable: true },
  { header: 'Email', accessor: 'email', sortable: true, filterable: true, dataType: 'string', editable: true },
  { header: 'Age', accessor: 'age', sortable: true, filterable: true, dataType: 'number', editable: true },
  { 
    header: 'Hire Date', 
    accessor: 'hireDate', 
    sortable: true, 
    filterable: true, 
    dataType: 'date',
    dateOptions: { locale: 'en-US', dateStyle: 'long' },
    editable: true,
  },
  { 
    header: 'Last Login', 
    accessor: 'lastLogin', 
    sortable: true, 
    filterable: true, 
    dataType: 'datetime',
    dateOptions: { locale: 'en-US', dateStyle: 'medium', timeStyle: 'short' },
    editable: true,
  },
  { header: 'City', accessor: 'city', sortable: true, filterable: true, dataType: 'string', editable: true, groupable: true },
  { 
    header: 'Status', 
    accessor: 'status', 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    cell: (item: User) => React.createElement(GenericPill, { 
        value: item.status,
        colorMap: {
            active: 'bg-green-500/20 text-green-300',
            inactive: 'bg-red-500/20 text-red-300',
            pending: 'bg-yellow-500/20 text-yellow-300',
        }
    }),
    groupable: true,
    align: 'center'
  },
  { header: 'Subscribed', accessor: 'isSubscribed', sortable: true, cellType: 'toggle', align: 'center' },
  
  // Collection column examples
  {
    header: 'Skills',
    accessor: 'skills',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'traditional', // Traditional input with auto display mode
      viewDisplayMode: 'auto', // Smart detection based on selection count
      maxSelections: 8,
      searchable: true,
      placeholder: 'Select skills...',
      inlineThreshold: 3,
      maxVisibleInline: 4,
      options: [
        { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
        { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
        { value: 'react', label: 'React', color: '#61dafb' },
        { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
        { value: 'angular', label: 'Angular', color: '#dd0031' },
        { value: 'nodejs', label: 'Node.js', color: '#339933' },
        { value: 'python', label: 'Python', color: '#3776ab' },
        { value: 'django', label: 'Django', color: '#092e20' },
        { value: 'figma', label: 'Figma', color: '#f24e1e' },
        { value: 'sketch', label: 'Sketch', color: '#f7b500' },
        { value: 'product-management', label: 'Product Management', color: '#6366f1' },
        { value: 'analytics', label: 'Analytics', color: '#059669' },
        { value: 'marketing', label: 'Marketing', color: '#dc2626' },
        { value: 'copywriting', label: 'Copywriting', color: '#7c3aed' },
        { value: 'sales', label: 'Sales', color: '#ea580c' },
        { value: 'negotiation', label: 'Negotiation', color: '#0891b2' },
        { value: 'customer-service', label: 'Customer Service', color: '#65a30d' },
        { value: 'zendesk', label: 'Zendesk', color: '#03363d' },
        { value: 'journalism', label: 'Journalism', color: '#374151' },
        { value: 'writing', label: 'Writing', color: '#4b5563' },
        { value: 'leadership', label: 'Leadership', color: '#991b1b' },
        { value: 'strategy', label: 'Strategy', color: '#7e22ce' }
      ]
    } as CollectionConfig,
    groupable: true
  },
  {
    header: 'Department',
    accessor: 'department',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'radio',
      required: true,
      clearable: false,
      placeholder: 'Select department...',
      options: [
        { value: 'engineering', label: 'Engineering', color: '#3b82f6' },
        { value: 'design', label: 'Design', color: '#8b5cf6' },
        { value: 'product', label: 'Product', color: '#06b6d4' },
        { value: 'marketing', label: 'Marketing', color: '#f59e0b' },
        { value: 'sales', label: 'Sales', color: '#10b981' },
        { value: 'support', label: 'Support', color: '#ef4444' }
      ]
    } as CollectionConfig,
    groupable: true,
    align: 'center'
  },
  {
    header: 'Permissions',
    accessor: 'permissions',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips', // Modern chip-based input
      viewDisplayMode: 'dropdown', // Collapse large selections
      maxSelections: 10,
      minSelections: 1,
      selectAllOption: true,
      searchable: true,
      placeholder: 'Select permissions...',
      inlineThreshold: 2,
      options: [
        { value: 'read', label: 'Read Access', color: '#10b981' },
        { value: 'write', label: 'Write Access', color: '#3b82f6' },
        { value: 'delete', label: 'Delete Access', color: '#ef4444' },
        { value: 'admin', label: 'Admin Access', color: '#8b5cf6' },
        { value: 'audit', label: 'Audit Access', color: '#f59e0b' },
        { value: 'export', label: 'Export Access', color: '#6b7280' }
      ]
    } as CollectionConfig,
    groupable: true
  },
  {
    header: 'Tags',
    accessor: 'tags',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'tag',
      allowCustomValues: true,
      maxTags: 10,
      minLength: 2,
      maxLength: 20,
      duplicateAllowed: false,
      caseSensitive: false,
      separator: ',',
      inputMode: 'traditional',
      viewDisplayMode: 'inline',
      placeholder: 'Add tags...',
      inlineThreshold: 5,
      maxVisibleInline: 6,
      options: [
        { value: 'senior', label: 'Senior', color: '#059669' },
        { value: 'junior', label: 'Junior', color: '#0891b2' },
        { value: 'frontend', label: 'Frontend', color: '#3b82f6' },
        { value: 'backend', label: 'Backend', color: '#7c3aed' },
        { value: 'fullstack', label: 'Fullstack', color: '#dc2626' },
        { value: 'ui-ux', label: 'UI/UX', color: '#f59e0b' },
        { value: 'product-owner', label: 'Product Owner', color: '#10b981' },
        { value: 'content', label: 'Content', color: '#6b7280' },
        { value: 'social-media', label: 'Social Media', color: '#ec4899' },
        { value: 'enterprise', label: 'Enterprise', color: '#1f2937' },
        { value: 'b2b', label: 'B2B', color: '#374151' },
        { value: 'helpdesk', label: 'Helpdesk', color: '#4b5563' },
        { value: 'content-creator', label: 'Content Creator', color: '#6366f1' },
        { value: 'captain', label: 'Captain', color: '#8b5cf6' },
        { value: 'legacy', label: 'Legacy', color: '#9ca3af' }
      ]
    } as CollectionConfig,
    groupable: true
  }
];

export const productColumns: Column<Product>[] = [
  { header: 'Featured', accessor: 'isFeatured', sortable: true, cellType: 'checkbox', groupable: true, align: 'center' },
  { header: 'Product ID', accessor: 'id', sortable: true, filterable: true, dataType: 'string' },
  { header: 'Name', accessor: 'name', sortable: true, filterable: true, dataType: 'string', editable: true },
  { header: 'Category', accessor: 'category', sortable: true, filterable: true, dataType: 'string', groupable: true },
  { 
    header: 'Price', 
    accessor: 'price', 
    sortable: true, 
    filterable: true,
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
    editable: true
  },
  { 
    header: 'Stock', 
    accessor: 'stock', 
    sortable: true, 
    filterable: true,
    dataType: 'number',
    cell: (item: Product) => (
      React.createElement('span', {
        className: item.stock === 0 ? 'text-red-400 font-semibold' : ''
      }, item.stock > 0 ? item.stock : 'Out of Stock')
    ),
    editable: true
  },
  
  // Collection columns for products
  {
    header: 'Categories',
    accessor: 'categories',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips', // Chip input with inline display
      viewDisplayMode: 'inline', // Show directly in cells
      maxSelections: 4,
      minSelections: 1,
      searchable: true,
      placeholder: 'Select categories...',
      inlineThreshold: 3,
      maxVisibleInline: 3,
      options: [
        { value: 'electronics', label: 'Electronics', color: '#3b82f6' },
        { value: 'computers', label: 'Computers', color: '#1e40af' },
        { value: 'smart-home', label: 'Smart Home', color: '#7c3aed' },
        { value: 'accessories', label: 'Accessories', color: '#059669' },
        { value: 'books', label: 'Books', color: '#dc2626' },
        { value: 'fiction', label: 'Fiction', color: '#b91c1c' },
        { value: 'non-fiction', label: 'Non-Fiction', color: '#991b1b' },
        { value: 'education', label: 'Education', color: '#7c2d12' },
        { value: 'clothing', label: 'Clothing', color: '#f59e0b' },
        { value: 'outerwear', label: 'Outerwear', color: '#d97706' },
        { value: 'footwear', label: 'Footwear', color: '#92400e' },
        { value: 'athletic', label: 'Athletic', color: '#78350f' },
        { value: 'home-goods', label: 'Home Goods', color: '#10b981' },
        { value: 'kitchen', label: 'Kitchen', color: '#059669' }
      ]
    } as CollectionConfig,
    groupable: true
  },
  {
    header: 'Features',
    accessor: 'features',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'chip',
      inputMode: 'traditional',
      viewDisplayMode: 'dropdown', // Collapse feature lists
      maxSelections: 6,
      searchable: true,
      placeholder: 'Select features...',
      inlineThreshold: 2,
      options: [
        { value: 'touchscreen', label: 'Touchscreen', color: '#6366f1' },
        { value: 'fast-charging', label: 'Fast Charging', color: '#8b5cf6' },
        { value: 'lightweight', label: 'Lightweight', color: '#06b6d4' },
        { value: 'bestseller', label: 'Bestseller', color: '#f59e0b' },
        { value: 'hardcover', label: 'Hardcover', color: '#10b981' },
        { value: 'cotton', label: 'Cotton', color: '#ef4444' },
        { value: 'sustainable', label: 'Sustainable', color: '#22c55e' },
        { value: 'classic-fit', label: 'Classic Fit', color: '#a855f7' },
        { value: 'voice-control', label: 'Voice Control', color: '#3b82f6' },
        { value: 'wifi', label: 'WiFi', color: '#06b6d4' },
        { value: 'bluetooth', label: 'Bluetooth', color: '#8b5cf6' },
        { value: 'programmable', label: 'Programmable', color: '#f59e0b' },
        { value: 'auto-shutoff', label: 'Auto Shutoff', color: '#ef4444' },
        { value: 'breathable', label: 'Breathable', color: '#10b981' },
        { value: 'cushioned', label: 'Cushioned', color: '#f97316' },
        { value: 'illustrated', label: 'Illustrated', color: '#ec4899' },
        { value: 'comprehensive', label: 'Comprehensive', color: '#6b7280' },
        { value: 'updated-edition', label: 'Updated Edition', color: '#14b8a6' },
        { value: 'ergonomic', label: 'Ergonomic', color: '#84cc16' },
        { value: 'long-battery', label: 'Long Battery', color: '#eab308' },
        { value: 'luxury', label: 'Luxury', color: '#dc2626' },
        { value: 'hand-crafted', label: 'Hand Crafted', color: '#7c3aed' },
        { value: 'gift-ready', label: 'Gift Ready', color: '#059669' },
        { value: 'high-power', label: 'High Power', color: '#ea580c' },
        { value: 'easy-clean', label: 'Easy Clean', color: '#0891b2' },
        { value: 'multiple-speeds', label: 'Multiple Speeds', color: '#65a30d' }
      ]
    } as CollectionConfig,
    groupable: true
  }
];