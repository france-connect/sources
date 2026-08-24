# @fc/modal

React library for managing modals through a central registry and context, with DSFR-compliant shell components built on the native `<dialog>` element.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Modal Registry](#modal-registry)
- [Components](#components)
- [API](#api)
- [Types and Interfaces](#types-and-interfaces)
- [Dependencies](#dependencies)

## Installation

This library is part of the FranceConnect monorepo. It is available via the `@fc/modal` alias.

```typescript
import { ModalProvider, useModal } from '@fc/modal';
```

## Configuration

The library requires configuration via `@fc/config` with the `Modal` key (`ModalOptions.CONFIG_NAME`).

### Configuration Interface

```typescript
interface ModalConfigInterface {
  registry: ModalRegistryInterface;
}
```

### Configuration Example

```typescript
import { ConfigService } from '@fc/config';
import { ModalOptions } from '@fc/modal';
import type { ModalRegistryInterface } from '@fc/modal';

// Each entry declares the component to render and the i18n key of its title.
// The title is owned by the registry so the shell always renders an accessible
// `fr-modal__title` bound to the dialog `aria-labelledby`.
const modalRegistry: ModalRegistryInterface = {
  'delete-instance-modal': {
    component: DeleteInstanceModal,
    footer: DeleteInstanceModalFooter,
    title: 'Partners.deleteInstanceModal.title',
  },
  'user-details-modal': {
    component: UserDetailsModal,
    title: 'Partners.userDetailsModal.title',
    titleHeading: HeadingTag.H2,
  },
};

export const ModalConfig: ModalConfigInterface = {
  registry: modalRegistry,
};
```

## Basic Usage

### 1. Wrap your application with the Provider

`ModalProvider` must be placed inside a tree where `ConfigService` is already initialized.

```tsx
import { ModalProvider } from '@fc/modal';

function App() {
  return (
    <ModalProvider>
      <YourAppContent />
    </ModalProvider>
  );
}
```

### 2. Open and close modals from any child component

```tsx
import { useModal } from '@fc/modal';

function DeleteButton({ userId }: { userId: string }) {
  const { openModal } = useModal();

  return (
    <button type="button" onClick={() => openModal('confirm-delete', { userId })}>
      Delete
    </button>
  );
}
```

### 3. Implement a modal component in the registry

Each registry entry receives its custom props plus an `onClose` callback injected by the provider.

The title is declared by the registry entry, the component only renders the body.

```tsx
interface ConfirmDeleteModalProps {
  userId: string;
}

function ConfirmDeleteModal({ userId }: ConfirmDeleteModalProps) {
  return <p>Are you sure you want to delete user {userId}?</p>;
}
```

### 4. Implement the modal footer

Action buttons belong to the optional `footer` entry, it receives the same props as the content
and is rendered by the shell into the DSFR `fr-modal__footer`.

The footer must remain a sibling of `fr-modal__content`: its negative top margin cancels the
content bottom margin, nesting it into the content makes it overlap the last paragraphs.

```tsx
interface ConfirmDeleteModalFooterProps {
  onClose: () => void;
  userId: string;
}

function ConfirmDeleteModalFooter({ onClose, userId }: ConfirmDeleteModalFooterProps) {
  return (
    <>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
      <button type="button" onClick={() => handleDelete(userId).then(onClose)}>
        Confirm
      </button>
    </>
  );
}
```

## Modal Registry

The registry maps a string identifier to a registry entry. When `openModal(id, props)` is called:

1. The identifier is checked against the registry, an unknown one is ignored.
2. The entry component is rendered inside `ModalShellComponent` (DSFR layout, portal to `document.body`).
3. The shell renders the entry `title` through `ModalTitleComponent` and binds it to the dialog.
4. The entry `footer`, when declared, is rendered through `ModalFooterComponent`.
5. The provider injects `onClose` alongside the given `props`.

Only one modal can be open at a time. Opening a new modal replaces the current one.

### Registry entry

| Property       | Type                 | Description                                                     |
| -------------- | -------------------- | --------------------------------------------------------------- |
| `component`    | `ComponentType<any>` | Modal content, receives its own props plus `onClose`            |
| `footer`       | `ComponentType<any>` | Optional action buttons, receives the same props as `component` |
| `title`        | `string`             | i18n key rendered as the DSFR `fr-modal__title`                 |
| `titleHeading` | `HeadingTag`         | Optional heading level, defaults to `HeadingTag.H1`             |

## Components

Low-level DSFR building blocks are also exported for standalone use or custom modal implementations.

| Component                   | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| `ModalShellComponent`       | DSFR modal shell using `<dialog>`, portal, backdrop and escape handling |
| `ModalHeaderComponent`      | Modal header with close button                                          |
| `ModalTitleComponent`       | Accessible modal title (`<h1>` with `fr-modal__title`)                  |
| `ModalFooterComponent`      | Modal footer wrapper (`fr-modal__footer`)                               |
| `ModalCloseButtonComponent` | DSFR close button with i18n label                                       |

### Standalone shell example

```tsx
import { ModalShellComponent } from '@fc/modal';

function CustomModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShellComponent
      footer={
        <button type="button" onClick={onClose}>
          Close
        </button>
      }
      id="custom-modal"
      title="My modal"
      onClose={onClose}>
      <p>Modal content</p>
    </ModalShellComponent>
  );
}
```

`ModalShellComponent` handles:

- `showModal()` / `close()` lifecycle on the native `<dialog>` element
- Closing on backdrop click, Escape key (`cancel` event), and close button
- `aria-labelledby` when a `title` prop is provided

## API

### `ModalProvider`

React provider that manages modal state and renders the active modal from the registry.

#### Behavior

- Reads the modal registry from `ConfigService.get(ModalOptions.CONFIG_NAME)`
- Exposes `openModal`, `closeModal`, and `currentModal` through context
- Renders the active modal component inside `ModalShellComponent`

### `useModal`

Hook to access the modal context. Throws if used outside `ModalProvider` (via `useSafeContext` from `@fc/common`).

```typescript
interface ModalContextStateInterface {
  closeModal: () => void;
  currentModal: ModalEntryInterface | null;
  openModal: <TProps extends Record<string, unknown>>(id: string, props: TProps) => void;
}
```

### `useModalShell`

Lower-level hook used by `ModalShellComponent` to manage `<dialog>` behavior (open/close, backdrop, cancel).

## Types and Interfaces

### `ModalRegistryInterface`

```typescript
interface ModalContentProps {
  onClose: () => void;
}

interface ModalRegistryEntryInterface {
  // The registry holds heterogeneous modals: each one may require its own props
  // on top of `onClose`. Props contravariance rules out a strict shared type,
  // so any component is accepted.
  component: ComponentType<any>;
  footer?: ComponentType<any>;
  title: string;
  titleHeading?: HeadingTag;
}

type ModalRegistryInterface = Record<string, ModalRegistryEntryInterface>;
```

### `ModalEntryInterface`

```typescript
interface ModalEntryInterface<TProps = Record<string, unknown>> {
  id: string;
  props: TProps;
}
```

### `ModalOptions`

```typescript
enum ModalOptions {
  CONFIG_NAME = 'Modal',
}
```

## Dependencies

This library depends on:

- `@fc/common`: For `useSafeContext`
- `@fc/config`: For registry configuration
- `@fc/i18n`: For close button label (`FC.Common.close`)

## See Also

- [Modal Provider](./src/context/modal.provider.tsx)
- [Modal Shell](./src/components/modal-shell/modal-shell.component.tsx)
- [Configuration Interface](./src/interfaces/modal-config.interface.ts)
- [DSFR Modal documentation](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/modale)
