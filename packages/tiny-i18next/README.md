# i18n

This is a tiny and simple class for i18n translations. It supports placeholders and various plurals.
It requires a modern browser or node 16.x or greater

## Installation

Use npm, pnpm or yarn to install it.

```shell
pnpm add @savvagent/tiny-i18next
```

## Use

```JavaScript
import {I18next} from 'tiny-i18next';
const enTranslations = {
  "cancel": "Cancel",
  "checkout": "Checkout",
  "modal_body": "This is the modal body",
  "open": "Open",
  "title": "Find"
}

const t = new I18next(enTranslations)

const t = new I18next({ name: "George" });
const userName = t('name') // George

```

See src/test/I18next.spec.ts for other examples
