# Multi-Language Bootstrap 5 Support

## Overview
Enhanced the Bootstrap 5 VS Code extension with comprehensive multi-language support for modern web development frameworks.

## Supported Languages & Frameworks

### 🔵 Vue.js Support
- **File:** `vue.code-snippets`
- **Languages:** `vue`, `vue-html`
- **Snippets:** 9 specialized templates
- **Features:**
  - Template syntax with reactive data
  - Event handling with `@click`
  - Conditional rendering with `v-if`
  - List rendering with `v-for`
  - Two-way data binding with `v-model`
  - Vue Router integration
  - Component props and methods

**Key Snippets:**
- `!bs5-vue` - Complete Vue component template
- `bs5-vue-btn` - Button with loading states
- `bs5-vue-modal` - Reactive modal component
- `bs5-vue-form` - Form with validation
- `bs5-vue-table` - Table with sorting

### 🔴 Angular Support
- **File:** `angular.code-snippets`
- **Languages:** `html`, `typescript`
- **Snippets:** 11 specialized templates
- **Features:**
  - Property binding with `[property]`
  - Event binding with `(event)`
  - Template directives (`*ngFor`, `*ngIf`)
  - Reactive forms integration
  - Angular Router support
  - Two-way binding with `[(ngModel)]`

**Key Snippets:**
- `!bs5-angular` - Angular template
- `bs5-ng-btn` - Button with property binding
- `bs5-ng-form` - Reactive forms with validation
- `bs5-ng-navbar` - Router-integrated navbar
- `bs5-ng-table` - Table with trackBy functions

### 🟠 Svelte Support
- **File:** `svelte.code-snippets`
- **Languages:** `svelte`
- **Snippets:** 10 specialized templates
- **Features:**
  - Component props with `export let`
  - Reactive statements with `$:`
  - Event handling with `on:click`
  - Template logic with `{#if}`, `{#each}`
  - Two-way binding with `bind:value`
  - Slot content support

**Key Snippets:**
- `!bs5-svelte` - Svelte component template
- `bs5-svelte-btn` - Button with props
- `bs5-svelte-modal` - Modal with reactive visibility
- `bs5-svelte-form` - Form with binding
- `bs5-svelte-table` - Table with reactive sorting

### 🟣 PHP Support
- **File:** `php.code-snippets`
- **Languages:** `php`
- **Snippets:** 11 specialized templates
- **Features:**
  - Server-side rendering
  - XSS protection with `htmlspecialchars()`
  - Database integration patterns
  - Form handling and validation
  - Session management
  - URL parameter handling

**Key Snippets:**
- `!bs5-php` - PHP Bootstrap template
- `bs5-php-btn` - Dynamic button
- `bs5-php-form` - Form with server validation
- `bs5-php-navbar` - Navigation with auth
- `bs5-php-table` - Data table with sorting

## Language Configuration

The extension now supports 9 languages:
- `html` - Original HTML support
- `javascript` - JavaScript snippets
- `typescript` - TypeScript support
- `javascriptreact` - React JSX
- `typescriptreact` - React TSX
- `vue` - Vue single-file components
- `vue-html` - Vue templates
- `svelte` - Svelte components
- `php` - PHP templates

## Usage Examples

### Vue.js Example
```vue
<template>
  <!-- Type: bs5-vue-btn -->
  <button type="button" class="btn btn-primary" @click="handleClick" :disabled="isLoading">
    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
    {{ buttonText }}
  </button>
</template>
```

### Angular Example
```html
<!-- Type: bs5-ng-btn -->
<button type="button" class="btn btn-primary" (click)="handleClick()" [disabled]="isLoading">
  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
  {{ buttonText }}
</button>
```

### Svelte Example
```svelte
<!-- Type: bs5-svelte-btn -->
<button type="button" class="btn btn-primary" on:click={handleClick} disabled={isLoading}>
  {#if isLoading}
    <span class="spinner-border spinner-border-sm me-2"></span>
  {/if}
  {buttonText}
</button>
```

### PHP Example
```php
<!-- Type: bs5-php-btn -->
<button type="button" class="btn btn-<?php echo $buttonType ?? 'primary'; ?>" 
        <?php if ($isDisabled ?? false): ?>disabled<?php endif; ?>>
  <?php if ($isLoading ?? false): ?>
    <span class="spinner-border spinner-border-sm me-2"></span>
  <?php endif; ?>
  <?php echo $buttonText ?? 'Click me'; ?>
</button>
```

## Test Files

Test files are available in `test/examples/`:
- `vue-test.vue` - Vue.js snippets demo
- `angular-test.component.html` - Angular snippets demo
- `svelte-test.svelte` - Svelte snippets demo
- `php-test.php` - PHP snippets demo

## Version Information

- **Previous Version:** 1.10.0
- **Current Version:** 1.11.0
- **New Snippets Added:** 41 multi-language snippets
- **New Language Support:** 4 additional frameworks

## Features by Framework

| Framework | Components | Forms | Navigation | Tables | Modals | Validation |
|-----------|------------|-------|------------|--------|---------|------------|
| Vue.js    | ✅         | ✅    | ✅         | ✅     | ✅      | ✅         |
| Angular   | ✅         | ✅    | ✅         | ✅     | ✅      | ✅         |
| Svelte    | ✅         | ✅    | ✅         | ✅     | ✅      | ✅         |
| PHP       | ✅         | ✅    | ✅         | ✅     | ✅      | ✅         |

## Benefits

1. **Framework-Specific Syntax** - Each snippet uses the appropriate framework syntax
2. **Best Practices** - Incorporates framework-specific best practices
3. **XSS Protection** - PHP snippets include security measures
4. **Reactive Patterns** - Modern reactive programming patterns
5. **Accessibility** - ARIA attributes and semantic HTML
6. **Responsive Design** - Bootstrap 5.3.2 responsive utilities

This enhancement makes the Bootstrap 5 extension the most comprehensive multi-language Bootstrap snippet collection for VS Code!