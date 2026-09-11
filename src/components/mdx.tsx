import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

// component injections
import { Button, buttonVariants } from '@/components/ui/button';
import { DocViewer } from '@/components/ui/doc-viewer';
import { ExecutionSimulator } from '@/components/ui/execution-simulator';
import { Quiz } from '@/components/ui/quiz';
import { CodeTabs } from '@/components/animate-ui/components/animate/code-tabs';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...components,

    Accordion,
    Accordions,

    // buttons
    Button,
    buttonVariants,

    // doc viewer
    DocViewer,

    // execution simulator
    ExecutionSimulator,

    // interactive quiz
    Quiz,

    // code tabs
    CodeTabs,
    
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
