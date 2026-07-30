# MediGem Frontend Engineering Guidelines & Standards

> **TypeScript Conventions, Code Standards, and Commit Rules**

---

## 🛠️ Engineering Standards

1. **Strict TypeScript Compliance**:
   - `noImplicitAny: true` and `strict: true` enforced in `tsconfig.json`.
   - Never use `any` unless wrapping un-typed 3rd-party vendor code. Use `unknown` or explicit generics.

2. **Component File Conventions**:
   - Component filenames use PascalCase (e.g., `PatientForm.tsx`, `RiskBadgeCard.tsx`).
   - Hooks use camelCase with `use` prefix (e.g., `useTheme.ts`, `useDebounce.ts`).

3. **Git Commit Conventions**:
   - `feat(ui): add risk badge card component`
   - `fix(api): update request timeout handler`
   - `docs(frontend): add state management guidelines`
