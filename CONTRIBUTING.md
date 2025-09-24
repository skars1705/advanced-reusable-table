# Contributing to Advanced Reusable Table

Thank you for your interest in contributing to the Advanced Reusable Table component! This project aims to provide a powerful, accessible, and production-ready React table component for the community.

## 🤝 How to Contribute

We welcome contributions of all kinds:

- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new functionality
- 📖 **Documentation** - Improve guides, examples, and API docs
- 🔧 **Code Contributions** - Bug fixes, features, and optimizations
- 🧪 **Testing** - Add test coverage and identify edge cases
- 🎨 **Design** - UI/UX improvements and accessibility enhancements

## 📋 Before You Start

1. **Check existing issues** - Someone might already be working on what you have in mind
2. **Open an issue** - Discuss your idea with maintainers before starting work
3. **Read the docs** - Familiarize yourself with the project structure and API

## 🚀 Getting Started

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/YOUR_USERNAME/advanced-reusable-table.git
cd advanced-reusable-table
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Run Tests**
```bash
npm run test
npm run test:coverage  # View test coverage
```

### Project Structure

```
advanced-reusable-table/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── docs/                  # Documentation
├── examples/              # Usage examples
└── tests/                 # Test files
```

## 💻 Development Guidelines

### Code Style

- **TypeScript First** - All code should be strongly typed
- **Functional Components** - Use hooks and functional patterns
- **Accessibility** - WCAG 2.1 AA compliance is mandatory
- **Performance** - Consider large dataset implications
- **Testing** - Write tests for new features and bug fixes

### Naming Conventions

- **Components**: PascalCase (`TableHeader`, `FilterDropdown`)
- **Hooks**: camelCase starting with 'use' (`useTableData`, `useSelection`)
- **Types**: PascalCase (`TableColumn`, `FilterConfig`)
- **Files**: kebab-case (`table-header.tsx`, `use-selection.ts`)

### Code Quality

```bash
# Type checking
npm run typecheck

# Run tests
npm run test

# Build library
npm run build:lib
```

## 🧪 Testing Requirements

### Test Coverage Expectations

- **New Features**: Must include comprehensive tests
- **Bug Fixes**: Must include regression tests
- **Coverage**: Maintain >80% test coverage
- **Accessibility**: Include a11y tests using @testing-library

### Test Categories

1. **Unit Tests** - Component logic and utilities
2. **Integration Tests** - Component interactions
3. **Accessibility Tests** - WCAG compliance
4. **Performance Tests** - Large dataset handling

### Example Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReusableTable } from '../ReusableTable';

describe('ReusableTable', () => {
  it('should render table with provided data', () => {
    const columns = [{ header: 'Name', accessor: 'name' }];
    const data = [{ name: 'John Doe' }];

    render(<ReusableTable allColumns={columns} data={data} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should be accessible to screen readers', () => {
    // Accessibility test implementation
  });
});
```

## 📝 Pull Request Process

### Before Submitting

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
git checkout -b fix/issue-description
```

2. **Run Quality Checks**
```bash
npm run typecheck
npm run test
npm run build:lib
```

3. **Update Documentation**
- Add/update JSDoc comments
- Update README if needed
- Add examples for new features

### PR Template

**Description**
Brief description of changes and motivation

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

**Accessibility**
- [ ] WCAG compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility checked

**Performance**
- [ ] Large dataset testing completed
- [ ] No performance regressions introduced

## 🐛 Bug Reports

### Good Bug Report Includes:

1. **Clear Title** - Summarize the issue
2. **Environment** - React version, browser, OS
3. **Steps to Reproduce** - Minimal reproduction steps
4. **Expected Behavior** - What should happen
5. **Actual Behavior** - What actually happens
6. **Code Example** - Minimal code that reproduces the issue

### Bug Report Template

```markdown
**Environment**
- React version: 18.2.0
- Browser: Chrome 118
- OS: Windows 11

**Description**
Brief description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Bug occurs

**Expected Behavior**
Description of expected behavior

**Actual Behavior**
Description of what actually happens

**Code Example**
```tsx
// Minimal reproduction code
```

## 💡 Feature Requests

### Good Feature Request Includes:

1. **Use Case** - Why is this needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other approaches considered
4. **Implementation** - Technical considerations

## 🎨 Design Guidelines

### Accessibility Requirements

- **WCAG 2.1 AA** compliance minimum
- **Keyboard Navigation** - Full functionality without mouse
- **Screen Reader** - Proper ARIA labels and roles
- **Focus Management** - Clear visual focus indicators
- **Color Contrast** - Minimum 4.5:1 ratio

### Performance Guidelines

- **Large Datasets** - Test with 1000+ rows
- **Memory Usage** - Avoid memory leaks
- **Render Performance** - Minimize unnecessary re-renders
- **Bundle Size** - Keep additions minimal

## 📚 Documentation Standards

### Code Documentation

```typescript
/**
 * Filters table data based on provided filter configuration
 * @param data - Array of table row data
 * @param filters - Filter configuration array
 * @returns Filtered data array
 * @example
 * ```tsx
 * const filtered = filterData(users, [
 *   { key: 'name', operator: 'contains', value: 'John' }
 * ]);
 * ```
 */
export function filterData<T>(data: T[], filters: FilterConfig[]): T[] {
  // Implementation
}
```

### Example Documentation

- **Clear Use Cases** - Real-world scenarios
- **Complete Code** - Working examples
- **Explanations** - Why certain approaches are used
- **Accessibility Notes** - A11y considerations

## 🏷️ Release Process

### Version Guidelines

We follow [Semantic Versioning](https://semver.org/):
- **PATCH** (1.0.1) - Bug fixes
- **MINOR** (1.1.0) - New features, backward compatible
- **MAJOR** (2.0.0) - Breaking changes

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] NPM package published
- [ ] GitHub release created

## 🤔 Questions?

- **GitHub Issues** - Technical questions and discussions
- **Documentation** - Check existing docs first
- **Community** - Engage with other contributors

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Advanced Reusable Table!**

Your contributions help make this component better for the entire React community. Every contribution, no matter how small, is valued and appreciated.