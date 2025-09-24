# Contributing to @megha/advanced-reusable-table

Thank you for your interest in contributing to the Advanced Reusable Table! We welcome contributions from the community and are grateful for your support.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 16.0 or higher
- **npm**: 7.0 or higher (or **yarn**: 1.22+ or **pnpm**: 6.0+)
- **React**: 18.0+ or 19.0+
- **TypeScript**: 4.5+ (recommended but not required)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/advanced-reusable-table.git
   cd advanced-reusable-table
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Run tests**:
   ```bash
   npm run test
   ```

## 🏗️ Development Workflow

### Project Structure

```
src/
├── components/          # React components
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── themes/             # Theme definitions
└── __tests__/          # Test files
```

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the library for production
- `npm run build:lib` - Build the library only (for distribution)
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run typecheck` - Run TypeScript type checking

## 📝 Contribution Guidelines

### Code Style

We use the following tools to maintain code quality:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vitest** for testing

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(table): add support for custom cell renderers
fix(sorting): resolve issue with date column sorting
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write tests** for your changes (aim for >80% coverage)

4. **Update documentation** if needed

5. **Run all tests** and ensure they pass:
   ```bash
   npm run test:run
   npm run typecheck
   npm run build
   ```

6. **Commit your changes** with a meaningful commit message

7. **Push to your fork** and create a pull request

### Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the existing style and conventions
- [ ] All tests pass (`npm run test:run`)
- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow the conventional format
- [ ] PR description clearly explains the changes

## 🧪 Testing

### Test Structure

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test component interactions
- **Accessibility tests**: Ensure WCAG compliance
- **Visual regression tests**: Catch UI changes

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:run
```

### Writing Tests

We use **Vitest** and **React Testing Library**:

```tsx
import { render, screen } from '@testing-library/react';
import { ReusableTable } from '../ReusableTable';

test('renders table with data', () => {
  const columns = [{ header: 'Name', accessor: 'name' }];
  const data = [{ name: 'John Doe' }];

  render(<ReusableTable columns={columns} data={data} />);

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

## 🔍 Code Review

All contributions go through code review. Here's what reviewers look for:

- **Functionality**: Does the code work as expected?
- **Performance**: Is the code efficient and optimized?
- **Accessibility**: Does it maintain WCAG 2.1 AA compliance?
- **Testing**: Are there adequate tests with good coverage?
- **Documentation**: Is the code well-documented?
- **Consistency**: Does it follow project conventions?

## 📖 Documentation

### API Documentation

When adding new features, update:

- **TypeScript interfaces** with JSDoc comments
- **README.md** with usage examples
- **Component stories** for Storybook (if applicable)

### Example Documentation

```tsx
interface TableColumn<T> {
  /** The header text for the column */
  header: string;
  /** The key to access data from row objects */
  accessor: keyof T;
  /** Whether the column is sortable */
  sortable?: boolean;
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (React version, browser, etc.)
6. **Minimal code example** that demonstrates the issue

Use our bug report template:

```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- React version: 18.2.0
- Browser: Chrome 91
- OS: Windows 10
```

## 💡 Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and problem you're solving
3. **Provide examples** of how the feature would be used
4. **Consider backwards compatibility**

## 🔧 Development Tips

### Debugging

- Use **React DevTools** for component debugging
- Use **Chrome DevTools** for performance profiling
- Enable **strict mode** to catch potential issues

### Performance

- Use **React.memo** for expensive components
- Implement **useMemo** for expensive calculations
- Use **useCallback** for stable function references
- Profile with React DevTools Profiler

### Accessibility

- Test with **screen readers** (NVDA, JAWS, VoiceOver)
- Ensure **keyboard navigation** works properly
- Use **semantic HTML** elements
- Test **color contrast** ratios

## 📞 Getting Help

If you need help:

1. **Check the documentation** in the `/docs` folder
2. **Search existing issues** on GitHub
3. **Create a discussion** for questions
4. **Join our community** (if applicable)

## 🏆 Recognition

Contributors are recognized in:

- **CHANGELOG.md** for each release
- **README.md** contributors section
- **GitHub releases** acknowledgments

Thank you for contributing to make this library better for everyone! 🎉

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.