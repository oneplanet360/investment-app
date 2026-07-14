# 12 - Components

The frontend relies heavily on reusable components to maintain consistency.

## Common Components (`/components/common`)
- **Pagination:** Handles list slicing and API offsets.
- **Tables:** Reusable table components for deposits, withdrawals, KYC, investments.
- **Form Inputs:** Styled inputs integrated with React Hook Form.

## Admin Components (`/components/admin`)
- **Details (`details.tsx`):** A massive (21KB) shared component used to render both Agent and Investor detail views. It handles displaying profile data, statistics, and embedding actions (Ban, Impersonate, Notification).
- **Layouts:** Sidebar navigation, top headers.

## Shared Structure
Pages generally compose common layout wrappers and table components, passing in data from React Query hooks.
