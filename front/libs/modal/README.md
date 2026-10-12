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

// The registry only maps an identifier to a component: the DSFR shell and its
// title belong to the modal, which renders whatever its use case requires.
const modalRegistry: ModalRegistryInterface = {
  'delete-instance-modal': DeleteInstanceModal,
  'delete-contributor-modal': DeleteContributorModal,
  'user-details-modal': UserDetailsModal,
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

Each registry component receives its custom props plus the `id` and `onClose` values injected by
the provider. It mounts its own `ModalShellComponent` and owns everything the DSFR exposes: the
title and its heading level, the content, and whether the modal asks for a confirmation.

```tsx
import { type ModalContentProps, ModalShellComponent } from '@fc/modal';

interface ConfirmDeleteModalProps extends ModalContentProps {
  userId: string;
  onConfirm: () => void | Promise<void>;
}

function ConfirmDeleteModal({ id, userId, onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <ModalShellComponent
      id={id}
      title={t('Partners.confirmDeleteModal.title')}
      onClose={onClose}
      onConfirm={onConfirm}>
      <p>Are you sure you want to delete user {userId}?</p>
    </ModalShellComponent>
  );
}
```

The `id` comes from the registry key, which keeps it the single source of truth: the shell derives
the `<dialog>` identifier and the `aria-labelledby` title binding from it.

### 4. Ask for a confirmation

Passing `onConfirm` to the shell renders the DSFR `fr-modal__footer` with its cancel/confirm pair.
The footer awaits `onConfirm` then closes the modal, so a modal only declares what confirming means.
Leaving `onConfirm` out renders no footer at all.

The footer stays a sibling of `fr-modal__content`: its negative top margin cancels the content
bottom margin, nesting it into the content makes it overlap the last paragraphs.

## Modal Registry

The registry maps a string identifier to a component. When `openModal(id, props)` is called:

1. The identifier is checked against the registry, an unknown one is ignored.
2. The registered component is rendered, it mounts the DSFR shell itself.
3. The provider injects `id` and `onClose` alongside the given `props`.

Only one modal can be open at a time. Opening a new modal replaces the current one.

### Injected props

| Property  | Type         | Description                                                |
| --------- | ------------ | ---------------------------------------------------------- |
| `id`      | `string`     | The registry key, to be forwarded to `ModalShellComponent` |
| `onClose` | `() => void` | Closes the modal, to be forwarded to `ModalShellComponent` |

## Components

Low-level DSFR building blocks are also exported for standalone use or custom modal implementations.

| Component                   | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| `ModalShellComponent`       | DSFR modal shell using `<dialog>`, portal, backdrop and escape handling |
| `ModalHeaderComponent`      | Modal header with close button                                          |
| `ModalTitleComponent`       | Accessible modal title (`<h1>` with `fr-modal__title`)                  |
| `ModalFooterComponent`      | DSFR cancel/confirm footer, closes the modal once `onConfirm` resolves  |
| `ModalCloseButtonComponent` | DSFR close button with i18n label                                       |

### Standalone shell example

```tsx
import { ModalShellComponent } from '@fc/modal';

function CustomModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShellComponent id="custom-modal" title="My modal" onClose={onClose}>
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
- Renders the active modal component with its `id` and `onClose` props

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

### `useModalFooter`

Hook used by `ModalFooterComponent`, it awaits `onConfirm` before calling `onClose` so the modal
stays open until the confirmed action settles.

## Types and Interfaces

### `ModalRegistryInterface`

```typescript
interface ModalContentProps {
  id: string;
  onClose: () => void;
}

// The registry holds heterogeneous modals: each one may declare its own props
// on top of the injected ones. Props contravariance rules out a strict shared
// type, so any component is accepted.
type ModalRegistryInterface = Record<string, ComponentType<any>>;
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
- `@fc/dsfr`: For the footer buttons
- `@fc/i18n`: For the close button and the footer labels

## See Also

- [Modal Provider](./src/context/modal.provider.tsx)
- [Modal Shell](./src/components/modal-shell/modal-shell.component.tsx)
- [Configuration Interface](./src/interfaces/modal-config.interface.ts)
- [DSFR Modal documentation](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/modale)
