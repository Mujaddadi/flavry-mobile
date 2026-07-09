# Project: Flavry

Flavry is a food discovery and delivery app for UK audiences.
Figma reference: https://www.figma.com/design/ty7JcXnIk2GWdi5Nv6NlC7/UIs?node-id=0-1

## Objectives

Allow users to discover dishes and restaurants, search for food, browse categories, view promotions, and add items to their cart — all from a single scrollable home screen.

## Architecture

- Expo, React Native, TypeScript, Jest, axios, dayjs, zustand, react-hook-form, zod
- expo-router, @tanstack/react-query, react-native-reanimated, flash-list
- @react-native-vector-icons/material-design-icons for icons
- Eslint, Prettier

## Directory Structure

- screens/ — this is where the code for the screens of the application is located
- common/ — this is where the code for the reusable common components of the application is located
- app/ - this is where the expo page routes are located
- apis/ - this is where the apis are added
- store/ - this is where zustand store is added
- tests/ - this is where jest tests are added
- utils/ - this is where utility functions are added
- types/ - this is where type definitions are added
- hooks/- this is where custom hooks are added
- assets/ - this is where styles and images are added
- specs/ - this is where feature specs are added

## Conventions

- All components are in their respective folders with the index.ts file that exports the component
- Use react-hook-form for managing form state and zod for validation
- Every component should be responsive. Use Dimensions API.
- Use percentage-based Dimensions.
- Text should scale dynamically according to the user's device settings for accessibility
- Use Eslint and Prettier for code formatting
- The types should be inside the types folder
- react-native-reanimated for animations
- Use TypeScript
- Use code comments wherever necessary

## Commands

- Run all tests | `npm run test` |
- Run lint | `npm run lint` |
- Run expo | `npm run start` |
- Run Android | `npm run android` |
- Run iOS | `npm run ios` |

## Hooks (Auto-run on every Write/Edit)

- Prettier formats the file automatically — don't run it manually after edits
- ESLint runs automatically on .ts/.tsx/.js/.jsx — check output before proceeding

## Accessibility

- Text should scale dynamically according to the user's device settings for accessibility
- Use Eslint and Prettier for code formatting
- The types should be inside the types folder

## Security Requirements (OWASP Top 10)
- 
- Follow OWASP Top 10 where applicable

## Workflow

- Write a spec in specs/ before implementing a new feature
- Use `/review` custom command to run a code review checklist before finishing

## DO NOT

- Don’t add new npm dependencies without asking

## Think Before Coding

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines, and it could be 50, rewrite it.
  Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.

## Goal-Driven Execution

**Define success criteria. Loop until verified.**
Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

## Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

## Success Criteria

The app follows the objective, tech stack, folder structure, and conventions.
There is no dead code.
There are no security vulnerabilities.
There are no performance issues.
There are no accessibility issues.
tests pass  
lint passes
