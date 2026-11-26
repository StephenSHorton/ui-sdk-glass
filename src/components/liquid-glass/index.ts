// Liquid Glass — glass components (React 19 + Tailwind CSS v4), drawn by one dependency-free engine.
// GlassButton, GlassTabs, GlassInput, GlassDatePicker, GlassSelect, GlassDropdownMenu, GlassPopover and GlassMenu take their behaviour from UI SDK (@ui-sdk/core, @ui-sdk/react).
// Copy the whole `liquid-glass/` folder, or install with the shadcn CLI (see README).
//
//   GlassButton        press   — swells under the pointer, bends the page behind it
//   GlassActionButton  merge   — its arrow is a droplet that melts in when pressed, and stays
//   GlassTabs          travel  — the selection travels as a magnifying lens
//   GlassBadge         flow    — text flows through the glass
//   GlassSlideToConfirm drag  — drag the glass thumb to the end to confirm
//   GlassCard          hold    — a card of glass: holds your content, its rim bends what slides behind
//   GlassButtonGroup   share   — related actions share one body of glass
//   GlassSelect        stretch — the list and its button are one liquid: a neck stretches between them, thins and snaps
//   GlassDropdownMenu  open    — actions pour out of the control that opens them, a whole button group included
//   GlassPopover       unfold  — the button unfolds into a small surface, right where it is
//   GlassMenu          grow    — the button's glass grows into a full menu, on whichever side the menu lies
//   GlassInput         type    — a field of glass you type on; search adds a magnifier and a clear button
//   GlassDatePicker    circle  — a date field of glass; its calendar swells out of the field as one body
//   GlassToaster       rise    — a short message rises on frosted glass after an action, stays a moment and goes
//   GlassTable         sort    — rows of data on one large sheet of glass; its headers sort
export { GlassButton, type GlassButtonProps, type GlassButtonSize } from './glass-button'
export { GlassActionButton, type GlassActionButtonProps, type GlassActionState } from './glass-action-button'
export { GlassTabs, type GlassTabsProps, type GlassTabOption } from './glass-tabs'
export { GlassBadge, type GlassBadgeProps } from './glass-badge'
export { GlassSlideToConfirm, type GlassSlideToConfirmProps, type GlassSlideState, type GlassSlideSize } from './glass-slide-to-confirm'
export { GlassCard, type GlassCardProps } from './glass-card'
export {
  GlassTable,
  GlassTableHeader,
  GlassTableBody,
  GlassTableFooter,
  GlassTableRow,
  GlassTableHead,
  GlassTableCell,
  GlassTableCaption,
  sortRows,
  type GlassTableProps,
  type GlassTableHeadProps,
  type GlassTableCellProps,
  type GlassTableSort,
  type GlassTableSortDirection,
} from './glass-table'
export {
  GlassButtonGroup,
  GlassButtonGroupItem,
  GlassButtonGroupSeparator,
  GlassButtonGroupText,
  type GlassButtonGroupProps,
  type GlassButtonGroupItemProps,
  type GlassButtonGroupSize,
  type GlassButtonGroupOrientation,
} from './glass-button-group'
export { GlassSelect, type GlassSelectProps, type GlassSelectOption } from './glass-select'
export {
  GlassDropdownMenu,
  GlassDropdownMenuTrigger,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuSeparator,
  type GlassDropdownMenuProps,
  type GlassDropdownMenuTriggerProps,
  type GlassDropdownMenuContentProps,
  type GlassDropdownMenuItemProps,
} from './glass-dropdown-menu'
export {
  GlassPopover,
  GlassPopoverTrigger,
  GlassPopoverContent,
  GlassPopoverTitle,
  GlassPopoverDescription,
  GlassPopoverClose,
  type GlassPopoverProps,
  type GlassPopoverTriggerProps,
  type GlassPopoverContentProps,
  type GlassPopoverCloseProps,
} from './glass-popover'
export {
  GlassMenu,
  GlassMenuTrigger,
  GlassMenuContent,
  GlassMenuItem,
  GlassMenuCheckboxItem,
  GlassMenuRadioGroup,
  GlassMenuRadioItem,
  GlassMenuGroup,
  GlassMenuLabel,
  GlassMenuShortcut,
  GlassMenuSeparator,
  GlassMenuSub,
  GlassMenuSubTrigger,
  GlassMenuSubContent,
  type GlassMenuProps,
  type GlassMenuTriggerProps,
  type GlassMenuContentProps,
  type GlassMenuItemProps,
  type GlassMenuCheckboxItemProps,
  type GlassMenuRadioItemProps,
  type GlassMenuSubTriggerProps,
} from './glass-menu'
export { GlassInput, type GlassInputProps } from './glass-input'
export { GlassDatePicker, type GlassDatePickerProps } from './glass-date-picker'
export { GlassToaster, createToaster, toast, type GlassToasterProps, type Toaster, type ToastData, type ToastType } from './glass-toast'
// Building blocks: GlassLens puts the travelling lens on your own tabs (Radix Tabs, a radiogroup).
export { GlassLens, type GlassLensProps } from './glass-lens'
// GlassPopup makes a popup (a select's list, a menu, a popover) one body with the control that opens it: on a neck (`stretch`), over the control (`morph`) or grown out of it (`grow`).
export { GlassPopupAnchor, GlassPopupSurface, GlassPopupText, useGlassPopup, type GlassPopup, type GlassPopupFrom, type GlassPopupOpening } from './glass-popup'
export { GlassLayer, GlassStyles, GLASS_CSS, type GlassLayerProps, type GlassMaterial, type GlassDroplet, type GlassOptics } from './glass-layer'
