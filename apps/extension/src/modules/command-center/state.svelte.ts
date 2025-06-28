// Define the state for the command center
export const commandCenterState = $state({
  isOpen: false
});

// Functions to update the state
export function openCommandCenter() {
  commandCenterState.isOpen = true;
}

export function closeCommandCenter() {
  commandCenterState.isOpen = false;
}
