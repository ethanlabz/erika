import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

// component injections
import { Button, buttonVariants } from '@/components/ui/button';
import { PDFViewer } from '@/components/pdf-viewer';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...components,

    Accordion,
    Accordions,

    // buttons
    Button,
    buttonVariants,

    // pdf viewer
    PDFViewer,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
