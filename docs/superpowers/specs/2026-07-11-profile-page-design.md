# Profile Page Design

## Goal

Replace the current profile menu with the personal-information profile page shown in the supplied reference. Preserve the existing Expo Router profile tab and bottom tab navigation.

## Layout

- Render an orange header with a back button, a `Profile` title, and a decorative food-themed treatment that follows the supplied reference as closely as the existing project assets allow.
- Continue the page on the app's warm white background with the text `Manage your personal information and account settings.`
- Show four vertically stacked information cards for name, email, address, and password.
- Each card contains a soft-orange icon circle, a muted field label, the current value, and an orange edit action.
- Use responsive spacing and sizes consistent with the project's theme and dimension helpers.
- Keep the existing bottom profile tab selected through the current Expo Router tab configuration.

## Editing Interaction

- Tapping a card's pencil action puts only that card into inline edit mode.
- In edit mode, the displayed value becomes a focused text input and the pencil changes to a checkmark.
- Tapping the checkmark commits the local value and returns the card to display mode.
- Name uses ordinary text entry, email uses the email-address keyboard and disables capitalization, address supports normal address text, and password uses secure text entry.
- The password card displays `Update Password` when it is not being edited and never reveals a saved password.
- Values are held in screen-local state because no profile API or authenticated user store exists in the current project.

## Components and Data Flow

- Keep `screens/Profile/Profile.tsx` as the screen entry point.
- Define a small reusable profile-field card within the profile feature to avoid duplicating the four card layouts.
- The screen owns committed field values. Each card owns its temporary draft and editing state, and reports a committed value through a callback.
- Continue using the installed Material Icons package; do not add dependencies.

## Navigation

- The back button uses Expo Router's back navigation when history exists. When the profile tab has no prior history, it returns to the app's home tab.
- Existing tab configuration remains unchanged except for adjustments proven necessary by visual verification.

## Accessibility and Resilience

- Edit and save controls expose button roles and field-specific accessibility labels.
- Inputs expose labels, appropriate keyboard types, return-key behavior, and readable dynamic text.
- Long profile values remain contained within their cards without colliding with the edit action.
- The screen remains scrollable on smaller devices and when the keyboard is shown.

## Verification

- Add focused tests confirming that tapping edit replaces a value with an input, typing updates the draft, and tapping save commits the new value.
- Add coverage for password secure-entry behavior.
- Run the focused profile test, the full Jest suite, TypeScript checking, and lint.
- Visually inspect the screen on a representative phone viewport if the local app can be launched.

## Out of Scope

- Server persistence, authentication, profile validation rules, password-change APIs, profile-photo upload, and new image assets are not included.
